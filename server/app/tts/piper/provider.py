from io import BytesIO
from threading import Lock
from typing import Any
import wave

from piper import PiperVoice

from app.tts.piper.config import PiperSettings
from app.tts.provider import SynthesizedSpeech


class PiperTTSProvider:
    def __init__(self, settings: PiperSettings | None = None) -> None:
        self._settings = settings or PiperSettings()
        self._voice: Any | None = None
        self._lock = Lock()

    def warmup(self) -> None:
        self._get_voice()

    def synthesize(self, text: str) -> SynthesizedSpeech:
        if not text.strip():
            raise ValueError("Cannot synthesize empty text.")

        with self._lock:
            voice = self._get_voice_locked()
            wav_buffer = BytesIO()
            with wave.open(wav_buffer, "wb") as wav_file:
                voice.synthesize_wav(text, wav_file)

        return SynthesizedSpeech(audio=wav_buffer.getvalue(), media_type="audio/wav")

    def _get_voice(self) -> Any:
        with self._lock:
            return self._get_voice_locked()

    def _get_voice_locked(self) -> Any:
        if self._voice is None:
            if not self._settings.model_path.is_file():
                raise FileNotFoundError(f"Piper voice model is missing: {self._settings.model_path}")
            if not self._settings.model_config_path.is_file():
                raise FileNotFoundError(
                    f"Piper voice configuration is missing: {self._settings.model_config_path}",
                )
            self._voice = PiperVoice.load(
                self._settings.model_path,
                use_cuda=self._settings.use_cuda,
            )
        return self._voice
