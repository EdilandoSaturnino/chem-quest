from dataclasses import dataclass
from os import getenv

VITE_DEVELOPMENT_ORIGINS = frozenset({
    "http://localhost:5173",
    "http://127.0.0.1:5173",
})


@dataclass(frozen=True)
class FasterWhisperSettings:
    model: str = getenv("CHEM_QUEST_STT_MODEL", "base")
    device: str = getenv("CHEM_QUEST_STT_DEVICE", "cpu")
    compute_type: str = getenv("CHEM_QUEST_STT_COMPUTE_TYPE", "int8")
    language: str = "pt"
    initial_prompt: str = "Português brasileiro. Nomes de elementos químicos."
