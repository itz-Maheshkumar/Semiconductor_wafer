# app/models/prediction.py
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from app.models.user import gen_id


class Prediction(SQLModel, table=True):
    id: str = Field(default_factory=lambda: gen_id("pred"), primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    image_url: str
    heatmap_url: Optional[str] = None

    predicted_class: str
    confidence: float
    class_probabilities_json: str  # JSON-encoded dict, see api schema layer