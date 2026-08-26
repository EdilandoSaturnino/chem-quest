# Chem Quest Server

## Requirements

- [mise](https://mise.jdx.dev/)
- [uv](https://docs.astral.sh/uv/)
- [Ollama](https://ollama.com/)
- [Piper](https://github.com/OHF-Voice/piper1-gpl)

## Setup and run

```bash
cd server
mise install
uv sync --all-groups
ollama pull qwen3
mkdir -p .models/piper
uv run python -m piper.download_voices --data-dir .models/piper pt_BR-faber-medium
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

FastAPI's generated documentation is available at `http://127.0.0.1:8000/docs`.

The first startup downloads and loads the Faster-Whisper `base` model. The default
profile is CPU with `int8` quantization and Portuguese transcription. Override its
runtime settings when needed:

```bash
CHEM_QUEST_STT_MODEL=small \
CHEM_QUEST_STT_DEVICE=cpu \
CHEM_QUEST_STT_COMPUTE_TYPE=int8 \
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Ollama must be running and have the configured model available before the server
starts. The default provider is local Ollama at `http://127.0.0.1:11434` using
the `qwen3` model. Change the provider settings with environment variables:

```bash
CHEM_QUEST_LLM_PROVIDER=ollama \
CHEM_QUEST_LLM_HOST=http://127.0.0.1:11434 \
CHEM_QUEST_LLM_MODEL=qwen3 \
CHEM_QUEST_LLM_SYSTEM_PROMPT_PATH=/caminho/para/orion-system.md \
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The default system prompt is [app/llm/prompts/orion-system.md](app/llm/prompts/orion-system.md).
Edit that file to change ORION's behavior, or set `CHEM_QUEST_LLM_SYSTEM_PROMPT_PATH`
to use another Markdown prompt file.

Piper is the default text-to-speech provider. Its provider-specific settings do
not apply to future external providers:

```bash
CHEM_QUEST_TTS_PROVIDER=piper \
CHEM_QUEST_TTS_PIPER_VOICE=pt_BR-faber-medium \
CHEM_QUEST_TTS_PIPER_DATA_DIR=.models/piper \
CHEM_QUEST_TTS_PIPER_USE_CUDA=false \
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The Piper model and its `.onnx.json` configuration are loaded during startup.
The `.models/` directory is ignored by Git.

## Voice WebSocket

Connect the browser to `ws://127.0.0.1:8000/ws/voice`. Each connection processes
one ordered turn at a time:

1. `speech_start` with `turnId`
2. `game_context` with `mode: "livre"` and `mixedElementSymbols`
3. one binary WebSocket frame containing raw 16 kHz mono `f32le` samples
4. `speech_end`

The server responds with `session_ready`, `assistant_started`, then either an
`assistant_audio` JSON message with `turnId` and `mimeType: "audio/wav"`, followed
by one binary WAV frame, or `assistant_error`. The transcription and generated
text are only used by the backend. Protocol violations return `protocol_error`
and close the socket. Input audio is limited to 60 seconds per turn.

## Tests

```bash
cd server
uv run pytest
```
