import asyncio
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FasterWhisperSettings, LLMSettings, TTSSettings, VITE_DEVELOPMENT_ORIGINS
from app.llm.factory import create_llm_provider
from app.stt.faster_whisper_provider import FasterWhisperProvider
from app.tts.factory import create_tts_provider
from app.websocket.voice_router import router as voice_router


def create_app() -> FastAPI:
    stt_provider = FasterWhisperProvider(FasterWhisperSettings())
    llm_provider = create_llm_provider(LLMSettings())
    tts_provider = create_tts_provider(TTSSettings())

    @asynccontextmanager
    async def lifespan(_: FastAPI) -> AsyncIterator[None]:
        await asyncio.gather(
            asyncio.to_thread(stt_provider.warmup),
            asyncio.to_thread(llm_provider.warmup),
            asyncio.to_thread(tts_provider.warmup),
        )
        yield

    app = FastAPI(title="Chem Quest Server", version="0.1.0", lifespan=lifespan)
    app.state.stt_provider = stt_provider
    app.state.llm_provider = llm_provider
    app.state.tts_provider = tts_provider
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
