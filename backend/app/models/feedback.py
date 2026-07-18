# app/models/feedback.py
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from app.models.user import gen_id


class Feedback(SQLModel, table=True):
    id: str = Field(default_factory=lambda: gen_id("fb"), primary_key=True)
    prediction_id: str = Field(foreign_key="prediction.id", unique=True, index=True)

    is_correct: bool
    corrected_class: Optional[str] = None

    submitted_by: str = Field(foreign_key="user.id")
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))