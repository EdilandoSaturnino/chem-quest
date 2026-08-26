from dataclasses import dataclass
from os import getenv
from pathlib import Path

DEFAULT_PIPER_DATA_DIR = Path(__file__).parents[3] / ".models" / "piper"


@dataclass(frozen=True)
class PiperSettings:
    voice: str = getenv("CHEM_QUEST_TTS_PIPER_VOICE", "pt_BR-faber-medium")
    data_dir: Path = Path(getenv("CHEM_QUEST_TTS_PIPER_DATA_DIR", str(DEFAULT_PIPER_DATA_DIR)))
    use_cuda: bool = getenv("CHEM_QUEST_TTS_PIPER_USE_CUDA", "false").lower() in {"1", "true", "yes"}

    @property
    def model_path(self) -> Path:
        return self.data_dir / f"{self.voice}.onnx"

    @property
    def model_config_path(self) -> Path:
        return self.data_dir / f"{self.voice}.onnx.json"
