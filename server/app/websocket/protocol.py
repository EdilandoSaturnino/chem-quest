from dataclasses import dataclass
from enum import StrEnum
from typing import Annotated, Literal
from uuid import UUID

import numpy as np
from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, ValidationError

MAX_AUDIO_SECONDS = 60
SAMPLE_RATE = 16_000
CHANNELS = 1
BYTES_PER_SAMPLE = 4
MAX_AUDIO_BYTES = MAX_AUDIO_SECONDS * SAMPLE_RATE * CHANNELS * BYTES_PER_SAMPLE


class ProtocolViolation(Exception):
    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


class VoiceMessage(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    type: str
    turn_id: UUID = Field(alias="turnId")


class SpeechStartMessage(VoiceMessage):
    type: Literal["speech_start"]


class GameContext(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    mode: Literal["livre"]
    mixed_element_symbols: list[str] = Field(alias="mixedElementSymbols", min_length=1, max_length=16)


class GameContextMessage(VoiceMessage):
    type: Literal["game_context"]
    context: GameContext


class SpeechEndMessage(VoiceMessage):
    type: Literal["speech_end"]


ClientMessage = Annotated[
    SpeechStartMessage | GameContextMessage | SpeechEndMessage,
    Field(discriminator="type"),
]
client_message_adapter = TypeAdapter(ClientMessage)


@dataclass(frozen=True)
class VoiceTurn:
    turn_id: UUID
    context: GameContext
    samples: np.ndarray


class TurnState(StrEnum):
    READY = "ready"
    AWAITING_CONTEXT = "awaiting_context"
    AWAITING_AUDIO = "awaiting_audio"
    AWAITING_END = "awaiting_end"
    TRANSCRIBING = "transcribing"


class VoiceTurnSession:
    def __init__(self) -> None:
        self._state = TurnState.READY
        self._turn_id: UUID | None = None
        self._context: GameContext | None = None
        self._samples: np.ndarray | None = None

    def receive_control(self, raw_message: object) -> VoiceTurn | None:
        message = self._parse(raw_message)

        if isinstance(message, SpeechStartMessage):
            self._receive_speech_start(message)
            return None
        if isinstance(message, GameContextMessage):
            self._receive_context(message)
            return None
        return self._receive_speech_end(message)

    def receive_audio(self, payload: bytes) -> None:
        if self._state is not TurnState.AWAITING_AUDIO:
            self._invalid_order("audio frame")
        self._samples = decode_audio(payload)
        self._state = TurnState.AWAITING_END

    def complete_turn(self) -> None:
        if self._state is not TurnState.TRANSCRIBING:
            raise RuntimeError("Cannot complete a turn that is not transcribing.")
        self._reset()

    def fail_turn(self) -> None:
        self._reset()

    def _receive_speech_start(self, message: SpeechStartMessage) -> None:
        if self._state is not TurnState.READY:
            self._invalid_order(message.type)
        self._turn_id = message.turn_id
        self._state = TurnState.AWAITING_CONTEXT

    def _receive_context(self, message: GameContextMessage) -> None:
        self._require_state(TurnState.AWAITING_CONTEXT, message)
        self._context = message.context
        self._state = TurnState.AWAITING_AUDIO

    def _receive_speech_end(self, message: SpeechEndMessage) -> VoiceTurn:
        self._require_state(TurnState.AWAITING_END, message)
        if self._context is None or self._samples is None or self._turn_id is None:
            raise RuntimeError("Completed turn is missing required data.")

        self._state = TurnState.TRANSCRIBING
        return VoiceTurn(turn_id=self._turn_id, context=self._context, samples=self._samples)

    def _require_state(self, expected: TurnState, message: VoiceMessage) -> None:
        if self._state is not expected:
            self._invalid_order(message.type)
        if message.turn_id != self._turn_id:
            raise ProtocolViolation("turn_id_mismatch", "Message turnId does not match the active turn.")

    def _invalid_order(self, message_type: str) -> None:
        raise ProtocolViolation(
            "invalid_message_order",
            f"Cannot receive {message_type} while session is {self._state}.",
        )

    def _parse(self, raw_message: object) -> ClientMessage:
        try:
            return client_message_adapter.validate_python(raw_message)
        except ValidationError as error:
            raise ProtocolViolation("invalid_message", "Message does not match the voice protocol.") from error

    def _reset(self) -> None:
        self._state = TurnState.READY
        self._turn_id = None
        self._context = None
        self._samples = None


def decode_audio(payload: bytes) -> np.ndarray:
    if not payload or len(payload) > MAX_AUDIO_BYTES or len(payload) % BYTES_PER_SAMPLE != 0:
        raise ProtocolViolation("invalid_audio", "Audio payload is not a valid Float32 segment.")

    samples = np.frombuffer(payload, dtype="<f4")
    if not np.isfinite(samples).all():
        raise ProtocolViolation("invalid_audio", "Audio samples must be finite values.")

    return samples.astype(np.float32, copy=True)
