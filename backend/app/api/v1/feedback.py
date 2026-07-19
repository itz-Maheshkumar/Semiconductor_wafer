# app/api/v1/feedback.py
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select

from app.db import get_session
from app.models import User, Prediction, Feedback
from app.api.deps import get_current_user
from app.schemas.prediction import PredictionOut, FeedbackOut
from app.api.v1.predictions import _prediction_to_out  # reuse existing mapper

router = APIRouter(prefix="/api/v1/predictions", tags=["feedback"])


class FeedbackRequest(BaseModel):
    is_correct: bool
    corrected_class: Optional[str] = None


@router.post("/{prediction_id}/feedback", response_model=PredictionOut)
def submit_feedback(
    prediction_id: str,
    payload: FeedbackRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    pred = session.get(Prediction, prediction_id)
    if not pred or pred.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "NOT_FOUND", "message": "Prediction not found."}},
        )

    if not payload.is_correct and not payload.corrected_class:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "MISSING_CORRECTED_CLASS", "message": "corrected_class is required when is_correct is false."}},
        )

    existing = session.exec(
        select(Feedback).where(Feedback.prediction_id == prediction_id)
    ).first()

    if existing:
        # Allow updating a previous correction rather than erroring —
        # simplest behavior for Phase 1, avoids a separate PATCH endpoint.
        existing.is_correct = payload.is_correct
        existing.corrected_class = payload.corrected_class if not payload.is_correct else None
        existing.submitted_by = current_user.id
        existing.submitted_at = datetime.now(timezone.utc)
        session.add(existing)
        session.commit()
        session.refresh(existing)
        feedback = existing
    else:
        feedback = Feedback(
            prediction_id=prediction_id,
            is_correct=payload.is_correct,
            corrected_class=payload.corrected_class if not payload.is_correct else None,
            submitted_by=current_user.id,
        )
        session.add(feedback)
        session.commit()
        session.refresh(feedback)

    return _prediction_to_out(pred, feedback)
