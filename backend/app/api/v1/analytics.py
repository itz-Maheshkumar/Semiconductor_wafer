# app/api/v1/analytics.py
from datetime import datetime
from typing import Dict, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select, func

from app.db import get_session
from app.models import User, Prediction
from app.api.deps import get_current_user
from app.ml.config import CLASS_NAMES

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])


class PredictionsOverTimeItem(BaseModel):
    date: str
    count: int


class AnalyticsSummary(BaseModel):
    total_predictions: int
    class_distribution: Dict[str, int]
    predictions_over_time: List[PredictionsOverTimeItem]


@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Total count
    total = session.exec(
        select(func.count()).select_from(Prediction).where(Prediction.user_id == current_user.id)
    ).one()

    # Class distribution
    class_counts_query = (
        select(Prediction.predicted_class, func.count())
        .where(Prediction.user_id == current_user.id)
        .group_by(Prediction.predicted_class)
    )
    class_counts_result = session.exec(class_counts_query).all()

    # Start every known class at 0 so the FE chart always has all 9 categories,
    # even ones with no predictions yet
    class_distribution = {name: 0 for name in CLASS_NAMES}
    for predicted_class, count in class_counts_result:
        class_distribution[predicted_class] = count

    # Predictions over time (grouped by date, SQLite date() function)
    time_query = (
        select(func.date(Prediction.created_at), func.count())
        .where(Prediction.user_id == current_user.id)
        .group_by(func.date(Prediction.created_at))
        .order_by(func.date(Prediction.created_at))
    )
    time_result = session.exec(time_query).all()

    predictions_over_time = [
        PredictionsOverTimeItem(date=str(date), count=count)
        for date, count in time_result
    ]

    return AnalyticsSummary(
        total_predictions=total,
        class_distribution=class_distribution,
        predictions_over_time=predictions_over_time,
    )
