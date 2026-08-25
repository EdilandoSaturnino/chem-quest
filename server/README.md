# Chem Quest Server

## Requirements

- [mise](https://mise.jdx.dev/)
- [uv](https://docs.astral.sh/uv/)

## Setup and run

```bash
cd server
mise install
uv sync --all-groups
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

## Voice WebSocket

Connect the browser to `ws://127.0.0.1:8000/ws/voice`. Each connection processes
one ordered turn at a time:

1. `speech_start` with `turnId`
2. `game_context` with `mode: "livre"` and `mixedElementSymbols`
3. one binary WebSocket frame containing raw 16 kHz mono `f32le` samples
4. `speech_end`

The server responds with `session_ready`, `transcription_started`, then either
`transcription` or `transcription_error`. Protocol violations return
`protocol_error` and close the socket. Audio is limited to 60 seconds per turn.

## Tests

```bash
cd server
uv run pytest
```
