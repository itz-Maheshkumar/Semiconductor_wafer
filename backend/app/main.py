# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.db import create_db_and_tables
from app.api.v1.auth import router as auth_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.feedback import router as feedback_router
import app.models  # noqa: F401

app = FastAPI(title="Wafer Defect Detection API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(predictions_router)

app.mount("/media", StaticFiles(directory="app/media"), name="media")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def root():
    return {"status": "ok", "message": "Wafer Defect Detection API is running"}

app.include_router(auth_router)
app.include_router(predictions_router)
app.include_router(feedback_router)
