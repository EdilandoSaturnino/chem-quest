# Chem Quest Server

## Requirements

- [mise](https://mise.jdx.dev/)
- [uv](https://docs.astral.sh/uv/)
- [Ollama](https://ollama.com/)

## Setup and run

```bash
cd server
mise install
uv sync --all-groups
ollama pull qwen3
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

## Voice WebSocket

Connect the browser to `ws://127.0.0.1:8000/ws/voice`. Each connection processes
one ordered turn at a time:

1. `speech_start` with `turnId`
2. `game_context` with `mode: "livre"` and `mixedElementSymbols`
3. one binary WebSocket frame containing raw 16 kHz mono `f32le` samples
4. `speech_end`

The server responds with `session_ready`, `assistant_started`, then either
`assistant_response` (with the generated text) or `assistant_error`. The
transcription is only sent to the configured LLM and is not returned to the
browser. Protocol violations return `protocol_error` and close the socket.
Audio is limited to 60 seconds per turn.

## Tests

```bash
cd server
uv run pytest
```
