from dataclasses import dataclass
from os import getenv
from pathlib import Path

VITE_DEVELOPMENT_ORIGINS = frozenset({
    "http://localhost:5173",
    "http://127.0.0.1:5173",
})
DEFAULT_LLM_SYSTEM_PROMPT_PATH = Path(__file__).parent / "llm" / "prompts" / "orion-system.md"


@dataclass(frozen=True)
class FasterWhisperSettings:
    model: str = getenv("CHEM_QUEST_STT_MODEL", "base")
    device: str = getenv("CHEM_QUEST_STT_DEVICE", "cpu")
    compute_type: str = getenv("CHEM_QUEST_STT_COMPUTE_TYPE", "int8")
    language: str = "pt"
    initial_prompt: str = "Português brasileiro. Nomes de elementos químicos."


@dataclass(frozen=True)
class LLMSettings:
    provider: str = getenv("CHEM_QUEST_LLM_PROVIDER", "ollama")
    host: str = getenv("CHEM_QUEST_LLM_HOST", "http://127.0.0.1:11434")
    model: str = getenv("CHEM_QUEST_LLM_MODEL", "qwen3")
    system_prompt_path: Path = Path(
        getenv("CHEM_QUEST_LLM_SYSTEM_PROMPT_PATH", str(DEFAULT_LLM_SYSTEM_PROMPT_PATH)),
    )
