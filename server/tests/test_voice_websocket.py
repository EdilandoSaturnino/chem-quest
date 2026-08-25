from uuid import uuid4

import numpy as np
import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

import app.main as main
from app.stt.provider import Transcription


class FakeSpeechToTextProvider:
    def __init__(self) -> None:
        self.calls: list[tuple[np.ndarray, int]] = []

    def warmup(self) -> None:
        pass

    def transcribe(self, samples: np.ndarray, sample_rate: int) -> Transcription:
        self.calls.append((samples, sample_rate))
        return Transcription(text="onde o sódio é usado", language="pt")


def test_transcribes_a_complete_voice_turn_and_accepts_the_next_turn(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    provider = FakeSpeechToTextProvider()
    app = create_test_app(monkeypatch, provider)

    with TestClient(app) as client:
        with client.websocket_connect("/ws/voice", headers={"origin": "http://localhost:5173"}) as websocket:
            assert websocket.receive_json() == {"type": "session_ready", "protocolVersion": 1}

            first_turn_id = send_complete_turn(websocket, [0.25, -0.25])
            assert websocket.receive_json() == {"type": "transcription_started", "turnId": first_turn_id}
            assert websocket.receive_json() == {
                "type": "transcription",
                "turnId": first_turn_id,
                "text": "onde o sódio é usado",
                "language": "pt",
            }

            second_turn_id = send_complete_turn(websocket, [0.5])
            assert websocket.receive_json() == {"type": "transcription_started", "turnId": second_turn_id}
            assert websocket.receive_json()["turnId"] == second_turn_id

    assert len(provider.calls) == 2
    assert provider.calls[0][1] == 16_000
    np.testing.assert_allclose(provider.calls[0][0], np.array([0.25, -0.25], dtype=np.float32))


def test_rejects_out_of_order_messages(monkeypatch: pytest.MonkeyPatch) -> None:
    app = create_test_app(monkeypatch, FakeSpeechToTextProvider())

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
    app = create_test_app(monkeypatch, FakeSpeechToTextProvider())

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
    provider: FakeSpeechToTextProvider,
):
    monkeypatch.setattr(main, "FasterWhisperProvider", lambda _: provider)
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
