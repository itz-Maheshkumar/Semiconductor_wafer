# app/schemas/prediction.py
from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel


class FeedbackOut(BaseModel):
    is_correct: bool
    corrected_class: Optional[str] = None
    submitted_by: str
    submitted_at: datetime


class PredictionOut(BaseModel):
    id: str
    user_id: str
    created_at: datetime
    image_url: str
    heatmap_url: Optional[str] = None
    predicted_class: str
    confidence: float
    class_probabilities: Dict[str, float]
    feedback: Optional[FeedbackOut] = None


class PredictionListOut(BaseModel):
    items: list[PredictionOut]
    page: int
    page_size: int
    total: int
    