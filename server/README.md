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

## Tests

```bash
cd server
uv run pytest
```

This bootstrap intentionally contains no custom API endpoints, WebSocket protocol, voice detection, transcription, language-model, or text-to-speech implementation yet.
