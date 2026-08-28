from threading import Lock

import numpy as np
from faster_whisper import WhisperModel

from app.config import FasterWhisperSettings
from app.stt.provider import Transcription


class FasterWhisperProvider:
    def __init__(self, settings: FasterWhisperSettings) -> None:
        self._settings = settings
        self._model: WhisperModel | None = None
        self._model_lock = Lock()
        self._inference_lock = Lock()

    def warmup(self) -> None:
        self._get_model()

    def transcribe(self, samples: np.ndarray, sample_rate: int) -> Transcription:
        if sample_rate != 16_000:
            raise ValueError("Faster-Whisper expects 16 kHz audio.")

        model = self._get_model()
        with self._inference_lock:
            segments, info = model.transcribe(
                samples,
                language=self._settings.language,
                task="transcribe",
                initial_prompt=self._settings.initial_prompt,
                vad_filter=False,
                beam_size=5,
            )
            text = "".join(segment.text for segment in segments).strip()

        return Transcription(text=text, language=info.language)

    def _get_model(self) -> WhisperModel:
        with self._model_lock:
            if self._model is None:
                self._model = WhisperModel(
                    self._settings.model,
                    device=self._settings.device,
                    compute_type=self._settings.compute_type,
                )
            return self._model
