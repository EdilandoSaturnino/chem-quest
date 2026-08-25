from uuid import uuid4

import numpy as np
import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

import app.main as main
from app.stt.provider import Transcription
from app.websocket.protocol import GameContext


class FakeSpeechToTextProvider:
    def __init__(self) -> None:
        self.calls: list[tuple[np.ndarray, int]] = []

    def warmup(self) -> None:
        pass

    def transcribe(self, samples: np.ndarray, sample_rate: int) -> Transcription:
        self.calls.append((samples, sample_rate))
        return Transcription(text="onde o sódio é usado", language="pt")


class FakeLLMProvider:
    def __init__(self, response: str = "O sódio é usado em lâmpadas e baterias.") -> None:
        self.response = response
        self.calls: list[tuple[str, GameContext]] = []
        self.warmup_calls = 0

    def warmup(self) -> None:
        self.warmup_calls += 1

    def respond(self, transcription: str, context: GameContext) -> str:
        self.calls.append((transcription, context))
        return self.response


def test_generates_an_assistant_response_for_a_complete_voice_turn_and_accepts_the_next_turn(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    stt_provider = FakeSpeechToTextProvider()
    llm_provider = FakeLLMProvider()
    app = create_test_app(monkeypatch, stt_provider, llm_provider)

    with TestClient(app) as client:
        with client.websocket_connect("/ws/voice", headers={"origin": "http://localhost:5173"}) as websocket:
            assert websocket.receive_json() == {"type": "session_ready", "protocolVersion": 1}

            first_turn_id = send_complete_turn(websocket, [0.25, -0.25])
            assert websocket.receive_json() == {"type": "assistant_started", "turnId": first_turn_id}
            assert websocket.receive_json() == {
                "type": "assistant_response",
                "turnId": first_turn_id,
                "text": "O sódio é usado em lâmpadas e baterias.",
            }

            second_turn_id = send_complete_turn(websocket, [0.5])
            assert websocket.receive_json() == {"type": "assistant_started", "turnId": second_turn_id}
            assert websocket.receive_json() == {
                "type": "assistant_response",
                "turnId": second_turn_id,
                "text": "O sódio é usado em lâmpadas e baterias.",
            }

    assert llm_provider.warmup_calls == 1
    assert len(stt_provider.calls) == 2
    assert stt_provider.calls[0][1] == 16_000
    np.testing.assert_allclose(stt_provider.calls[0][0], np.array([0.25, -0.25], dtype=np.float32))
    assert llm_provider.calls[0][0] == "onde o sódio é usado"
    assert llm_provider.calls[0][1].mixed_element_symbols == ["Na", "Cl"]


def test_reports_assistant_failure_without_returning_the_transcription(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class FailingLLMProvider(FakeLLMProvider):
        def respond(self, transcription: str, context: GameContext) -> str:
            raise RuntimeError("Ollama is unavailable")

    app = create_test_app(monkeypatch, FakeSpeechToTextProvider(), FailingLLMProvider())

    with TestClient(app) as client:
        with client.websocket_connect("/ws/voice", headers={"origin": "http://localhost:5173"}) as websocket:
            websocket.receive_json()
            turn_id = send_complete_turn(websocket, [0.25])

            assert websocket.receive_json() == {"type": "assistant_started", "turnId": turn_id}
            assert websocket.receive_json() == {
                "type": "assistant_error",
                "turnId": turn_id,
                "code": "assistant_failed",
            }


def test_refuses_to_start_when_the_llm_model_cannot_be_validated(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    class UnavailableLLMProvider(FakeLLMProvider):
        def warmup(self) -> None:
            raise RuntimeError("Qwen3 is unavailable")

    app = create_test_app(monkeypatch, FakeSpeechToTextProvider(), UnavailableLLMProvider())

    with pytest.raises(RuntimeError, match="Qwen3 is unavailable"):
        with TestClient(app):
            pass


def test_rejects_out_of_order_messages(monkeypatch: pytest.MonkeyPatch) -> None:
    app = create_test_app(monkeypatch, FakeSpeechToTextProvider(), FakeLLMProvider())

    with TestClient(app) as client:
        with client.websocket_connect("/ws/voice", headers={"origin": "http://localhost:5173"}) as websocket:
            websocket.receive_json()
            websocket.send_json({
                "type": "speech_end",
                "turnId": str(uuid4()),
            })

            error = websocket.receive_json()
            assert error["type"] == "protocol_error"
            assert error["code"] == "invalid_message_order"
            with pytest.raises(WebSocketDisconnect) as disconnected:
                websocket.receive_json()

    assert disconnected.value.code == 1008


def test_rejects_invalid_audio_payload(monkeypatch: pytest.MonkeyPatch) -> None:
    app = create_test_app(monkeypatch, FakeSpeechToTextProvider(), FakeLLMProvider())

    with TestClient(app) as client:
        with client.websocket_connect("/ws/voice", headers={"origin": "http://localhost:5173"}) as websocket:
            websocket.receive_json()
            turn_id = str(uuid4())
            websocket.send_json({"type": "speech_start", "turnId": turn_id})
            websocket.send_json({
                "type": "game_context",
                "turnId": turn_id,
                "context": {"mode": "livre", "mixedElementSymbols": ["Na", "Cl"]},
            })
            websocket.send_bytes(b"invalid")

            assert websocket.receive_json()["code"] == "invalid_audio"


def create_test_app(
    monkeypatch: pytest.MonkeyPatch,
    stt_provider: FakeSpeechToTextProvider,
    llm_provider: FakeLLMProvider,
):
    monkeypatch.setattr(main, "FasterWhisperProvider", lambda _: stt_provider)
    monkeypatch.setattr(main, "create_llm_provider", lambda _: llm_provider)
    return main.create_app()


def send_complete_turn(websocket: object, samples: list[float]) -> str:
    turn_id = str(uuid4())
    audio = np.array(samples, dtype="<f4").tobytes()
    websocket.send_json({"type": "speech_start", "turnId": turn_id})
    websocket.send_json({
        "type": "game_context",
        "turnId": turn_id,
        "context": {"mode": "livre", "mixedElementSymbols": ["Na", "Cl"]},
    })
    websocket.send_bytes(audio)
    websocket.send_json({"type": "speech_end", "turnId": turn_id})
    return turn_id
