from typing import Protocol

from app.websocket.protocol import GameContext


class LLMProvider(Protocol):
    def warmup(self) -> None:
        """Verify that the configured model is ready to serve requests."""

    def respond(self, transcription: str, context: GameContext) -> str:
        """Generate an assistant reply for a completed voice turn."""
