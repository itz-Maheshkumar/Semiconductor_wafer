# app/models/user.py
import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field


def gen_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:20]}"


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: gen_id("usr"), primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))