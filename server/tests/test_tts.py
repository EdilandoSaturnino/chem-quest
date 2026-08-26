import wave
from pathlib import Path

import pytest

import app.tts.piper.provider as piper_provider
from app.config import TTSSettings
from app.tts.factory import create_tts_provider
from app.tts.piper.config import PiperSettings
from app.tts.piper.provider import PiperTTSProvider


class FakePiperVoice:
    loaded: list[tuple[Path, bool]] = []

    @classmethod
    def load(cls, model_path: Path, use_cuda: bool) -> "FakePiperVoice":
        cls.loaded.append((model_path, use_cuda))
        return cls()

    def synthesize_wav(self, text: str, wav_file: wave.Wave_write) -> None:
        wav_file.setparams((1, 2, 22_050, 1, "NONE", "not compressed"))
        wav_file.writeframes(b"\x00\x00")


def test_piper_provider_loads_the_derived_voice_files_and_synthesizes_wav(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
) -> None:
    settings = PiperSettings(voice="pt_BR-faber-medium", data_dir=tmp_path, use_cuda=True)
    settings.model_path.write_bytes(b"model")
    settings.model_config_path.write_text("{}", encoding="utf-8")
    monkeypatch.setattr(piper_provider, "PiperVoice", FakePiperVoice)
    provider = PiperTTSProvider(settings)

    provider.warmup()
    speech = provider.synthesize("Tudo certo.")

    assert FakePiperVoice.loaded == [(settings.model_path, True)]
    assert speech.media_type == "audio/wav"
    assert speech.audio.startswith(b"RIFF")
    assert speech.audio[8:12] == b"WAVE"


def test_piper_provider_requires_the_model_and_its_configuration(tmp_path: Path) -> None:
    settings = PiperSettings(data_dir=tmp_path)
    provider = PiperTTSProvider(settings)

    with pytest.raises(FileNotFoundError, match="voice model is missing"):
        provider.warmup()

    settings.model_path.write_bytes(b"model")
    with pytest.raises(FileNotFoundError, match="voice configuration is missing"):
        provider.warmup()


def test_piper_provider_rejects_empty_text(tmp_path: Path) -> None:
    provider = PiperTTSProvider(PiperSettings(data_dir=tmp_path))

    with pytest.raises(ValueError, match="empty text"):
        provider.synthesize("  ")


def test_factory_creates_piper_without_exposing_piper_settings() -> None:
    assert isinstance(create_tts_provider(TTSSettings()), PiperTTSProvider)


def test_factory_rejects_an_unsupported_tts_provider() -> None:
    with pytest.raises(ValueError, match="Unsupported TTS provider"):
        create_tts_provider(TTSSettings(provider="elevenlabs"))
