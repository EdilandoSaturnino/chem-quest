from typing import Any

from ollama import Client

from app.config import LLMSettings
from app.websocket.protocol import GameContext


class OllamaLLMProvider:
    def __init__(self, settings: LLMSettings, client: Any | None = None) -> None:
        self._settings = settings
        self._client = client or Client(host=settings.host)
        self._system_prompt: str | None = None

    def warmup(self) -> None:
        self._get_system_prompt()
        self._client.show(self._settings.model)

    def respond(self, transcription: str, context: GameContext) -> str:
        response = self._client.chat(
            model=self._settings.model,
            messages=[
                {"role": "system", "content": self._get_system_prompt()},
                {"role": "user", "content": self._build_user_prompt(transcription, context)},
            ],
            stream=False,
        )
        text = response.message.content.strip()
        if not text:
            raise ValueError("Ollama returned an empty assistant response.")
        return text

    def _get_system_prompt(self) -> str:
        if self._system_prompt is None:
            self._system_prompt = self._settings.system_prompt_path.read_text(encoding="utf-8").strip()
            if not self._system_prompt:
                raise ValueError("The LLM system prompt file is empty.")
        return self._system_prompt

    @staticmethod
    def _build_user_prompt(transcription: str, context: GameContext) -> str:
        symbols = ", ".join(context.mixed_element_symbols)
        return (
            "Fala do usuário:\n"
            f"{transcription}\n\n"
            "Contexto observável do jogo:\n"
            f"- Modo: {context.mode}\n"
            f"- Símbolos dos elementos ativos na mistura: {symbols}\n\n"
            "Responda naturalmente à fala do usuário. Use o contexto somente se for relevante."
        )
