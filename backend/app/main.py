# app/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException as FastAPIHTTPException
import logging

from app.db import create_db_and_tables
from app.api.v1.auth import router as auth_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.feedback import router as feedback_router
from app.api.v1.analytics import router as analytics_router
import app.models  # noqa: F401

logger = logging.getLogger("uvicorn.error")

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
app.include_router(feedback_router)
app.include_router(analytics_router)

app.mount("/media", StaticFiles(directory="app/media"), name="media")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.exception_handler(FastAPIHTTPException)
async def http_exception_handler(request: Request, exc: FastAPIHTTPException):
    # If detail is already in our {"error": {...}} shape, pass it through as-is.
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    # Otherwise (e.g. FastAPI's own built-in errors), wrap it to match our contract
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "HTTP_ERROR", "message": str(exc.detail)}},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_ERROR", "message": "Something went wrong. Please try again."}},
    )


@app.get("/")
def root():
    return {"status": "ok", "message": "Wafer Defect Detection API is running"}
