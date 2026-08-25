from dataclasses import dataclass
from typing import Protocol

import numpy as np


@dataclass(frozen=True)
class Transcription:
    text: str
    language: str


class SpeechToTextProvider(Protocol):
    def warmup(self) -> None:
        """Load any model resources required before serving turns."""

    def transcribe(self, samples: np.ndarray, sample_rate: int) -> Transcription:
        """Transcribe mono Float32 audio samples."""
