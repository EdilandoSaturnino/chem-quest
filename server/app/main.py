import asyncio
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FasterWhisperSettings, VITE_DEVELOPMENT_ORIGINS
from app.stt.faster_whisper_provider import FasterWhisperProvider
from app.websocket.voice_router import router as voice_router


def create_app() -> FastAPI:
    provider = FasterWhisperProvider(FasterWhisperSettings())

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        await asyncio.to_thread(provider.warmup)
        yield

    app = FastAPI(title="Chem Quest Server", version="0.1.0", lifespan=lifespan)
    app.state.stt_provider = provider
    app.add_middleware(
        CORSMiddleware,
        allow_origins=sorted(VITE_DEVELOPMENT_ORIGINS),
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )
    app.include_router(voice_router)
    return app


app = create_app()
