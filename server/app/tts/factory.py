from app.config import TTSSettings
from app.tts.piper.provider import PiperTTSProvider
from app.tts.provider import TTSProvider


def create_tts_provider(settings: TTSSettings) -> TTSProvider:
    if settings.provider == "piper":
        return PiperTTSProvider()
    raise ValueError(f"Unsupported TTS provider: {settings.provider}")
