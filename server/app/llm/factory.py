from app.config import LLMSettings
from app.llm.ollama_provider import OllamaLLMProvider
from app.llm.provider import LLMProvider


def create_llm_provider(settings: LLMSettings) -> LLMProvider:
    if settings.provider == "ollama":
        return OllamaLLMProvider(settings)
    raise ValueError(f"Unsupported LLM provider: {settings.provider}")
