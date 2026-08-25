from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

VITE_DEVELOPMENT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(title="Chem Quest Server", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=VITE_DEVELOPMENT_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
