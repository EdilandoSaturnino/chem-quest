from dataclasses import dataclass
from typing import Protocol


@dataclass(frozen=True)
class SynthesizedSpeech:
    audio: bytes
    media_type: str


class TTSProvider(Protocol):
    def warmup(self) -> None:
        """Load and validate any resources required for synthesis."""

    def synthesize(self, text: str) -> SynthesizedSpeech:
        """Convert assistant text into playable audio."""
