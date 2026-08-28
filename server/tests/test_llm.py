from dataclasses import dataclass
from pathlib import Path

import pytest

import app.llm.ollama_provider as ollama_provider
from app.config import LLMSettings
from app.llm.factory import create_llm_provider
from app.llm.ollama_provider import OllamaLLMProvider
from app.websocket.protocol import GameContext


@dataclass
class FakeMessage:
    content: str


@dataclass
class FakeChatResponse:
    message: FakeMessage


class FakeOllamaClient:
    def __init__(self) -> None:
        self.shown_models: list[str] = []
        self.chat_requests: list[dict[str, object]] = []

    def show(self, model: str) -> None:
        self.shown_models.append(model)

    def chat(self, **kwargs: object) -> FakeChatResponse:
        self.chat_requests.append(kwargs)
        return FakeChatResponse(message=FakeMessage(content="  O cloro é um halogênio.  "))


def test_ollama_provider_validates_the_model_and_builds_a_contextual_prompt(tmp_path: Path) -> None:
    client = FakeOllamaClient()
    prompt_path = tmp_path / "system.md"
    prompt_path.write_text("Você é ORION.", encoding="utf-8")
    settings = LLMSettings(model="qwen3:8b", system_prompt_path=prompt_path)
    provider = OllamaLLMProvider(settings, client=client)
    context = GameContext(mode="livre", mixed_element_symbols=["Na", "Cl"])

    provider.warmup()
    response = provider.respond("O que é cloro?", context)

    assert client.shown_models == ["qwen3:8b"]
    assert response == "O cloro é um halogênio."
    assert client.chat_requests == [{
        "model": "qwen3:8b",
        "messages": [
            {"role": "system", "content": "Você é ORION."},
            {
                "role": "user",
                "content": (
                    "Fala do usuário:\nO que é cloro?\n\n"
                    "Contexto observável do jogo:\n- Modo: livre\n"
                    "- Símbolos dos elementos ativos na mistura: Na, Cl\n\n"
                    "Responda naturalmente à fala do usuário. Use o contexto somente se for relevante."
                ),
            },
        ],
        "stream": False,
    }]


def test_ollama_provider_rejects_empty_responses() -> None:
    class EmptyResponseClient(FakeOllamaClient):
        def chat(self, **kwargs: object) -> FakeChatResponse:
            return FakeChatResponse(message=FakeMessage(content="  "))

    provider = OllamaLLMProvider(LLMSettings(), client=EmptyResponseClient())

    with pytest.raises(ValueError, match="empty assistant response"):
        provider.respond("Olá", GameContext(mode="livre", mixed_element_symbols=["H"]))


def test_ollama_provider_rejects_an_empty_system_prompt_file(tmp_path: Path) -> None:
    prompt_path = tmp_path / "system.md"
    prompt_path.write_text("\n", encoding="utf-8")
    provider = OllamaLLMProvider(LLMSettings(system_prompt_path=prompt_path), client=FakeOllamaClient())

    with pytest.raises(ValueError, match="system prompt file is empty"):
        provider.warmup()


def test_ollama_provider_uses_the_configured_host(monkeypatch: pytest.MonkeyPatch) -> None:
    hosts: list[str] = []

    class CapturingClient(FakeOllamaClient):
        def __init__(self, host: str) -> None:
            super().__init__()
            hosts.append(host)

    monkeypatch.setattr(ollama_provider, "Client", CapturingClient)

    OllamaLLMProvider(LLMSettings(host="http://ollama.internal:11434"))

    assert hosts == ["http://ollama.internal:11434"]


def test_factory_creates_the_ollama_provider() -> None:
    assert isinstance(create_llm_provider(LLMSettings()), OllamaLLMProvider)


def test_factory_rejects_unsupported_provider() -> None:
    with pytest.raises(ValueError, match="Unsupported LLM provider"):
        create_llm_provider(LLMSettings(provider="unknown"))
