import asyncio
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.config import VITE_DEVELOPMENT_ORIGINS
from app.llm.provider import LLMProvider
from app.stt.provider import SpeechToTextProvider
from app.websocket.protocol import ProtocolViolation, VoiceTurn, VoiceTurnSession

router = APIRouter()


@router.websocket("/ws/voice")
async def voice_websocket(websocket: WebSocket) -> None:
    if websocket.headers.get("origin") not in VITE_DEVELOPMENT_ORIGINS:
        await websocket.close(code=1008)
        return

    stt_provider: SpeechToTextProvider = websocket.app.state.stt_provider
    llm_provider: LLMProvider = websocket.app.state.llm_provider
    session = VoiceTurnSession()
    await websocket.accept()
    await websocket.send_json({"type": "session_ready", "protocolVersion": 1})

    try:
        while True:
            try:
                turn = await receive_turn_message(websocket, session)
            except ProtocolViolation as error:
                await send_protocol_error(websocket, error)
                await websocket.close(code=1008)
                return

            if turn is None:
                continue

            await websocket.send_json({"type": "assistant_started", "turnId": str(turn.turn_id)})
            try:
                transcription = await asyncio.to_thread(stt_provider.transcribe, turn.samples, 16_000)
                response = await asyncio.to_thread(
                    llm_provider.respond,
                    transcription.text,
                    turn.context,
                )
            except Exception:
                session.fail_turn()
                await websocket.send_json({
                    "type": "assistant_error",
                    "turnId": str(turn.turn_id),
                    "code": "assistant_failed",
                })
                continue

            session.complete_turn()
            await websocket.send_json({
                "type": "assistant_response",
                "turnId": str(turn.turn_id),
                "text": response,
            })
    except WebSocketDisconnect:
        return


async def receive_turn_message(websocket: WebSocket, session: VoiceTurnSession) -> VoiceTurn | None:
    message = await websocket.receive()
    if message["type"] == "websocket.disconnect":
        raise WebSocketDisconnect(message.get("code", 1000))

    if (payload := message.get("bytes")) is not None:
        return session.receive_audio(payload)
    if message.get("text") is None:
        raise ProtocolViolation("invalid_message", "Voice protocol messages must be JSON text frames or audio binary frames.")

    try:
        return session.receive_control(json.loads(message["text"]))
    except json.JSONDecodeError as error:
        raise ProtocolViolation("invalid_message", "Voice protocol messages must contain JSON.") from error


async def send_protocol_error(websocket: WebSocket, error: ProtocolViolation) -> None:
    await websocket.send_json({
        "type": "protocol_error",
        "code": error.code,
        "message": error.message,
    })
