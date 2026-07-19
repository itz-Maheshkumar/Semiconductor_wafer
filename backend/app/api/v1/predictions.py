# app/api/v1/predictions.py
import json
import uuid
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlmodel import Session, select, func
from PIL import Image

from app.db import get_session
from app.models import User, Prediction, Feedback
from app.api.deps import get_current_user
from app.schemas.prediction import PredictionOut, PredictionListOut, FeedbackOut
from app.ml.inference import predict, generate_gradcam

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])

MEDIA_DIR = "app/media"
os.makedirs(MEDIA_DIR, exist_ok=True)


def _prediction_to_out(pred: Prediction, feedback: Optional[Feedback] = None) -> PredictionOut:
    return PredictionOut(
        id=pred.id,
        user_id=pred.user_id,
        created_at=pred.created_at,
        image_url=pred.image_url,
        heatmap_url=pred.heatmap_url,
        predicted_class=pred.predicted_class,
        confidence=pred.confidence,
        class_probabilities=json.loads(pred.class_probabilities_json),
        feedback=(
            FeedbackOut(
                is_correct=feedback.is_correct,
                corrected_class=feedback.corrected_class,
                submitted_by=feedback.submitted_by,
                submitted_at=feedback.submitted_at,
            )
            if feedback else None
        ),
    )


@router.post("", response_model=PredictionOut, status_code=201)
def create_prediction(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "INVALID_FILE", "message": "Uploaded file must be an image."}},
        )

    try:
        image = Image.open(file.file)
        image.load()
    except Exception:
        raise HTTPException(
            status_code=422,
            detail={"error": {"code": "INVALID_FILE", "message": "Could not read image file."}},
        )

    pred_id = f"pred_{uuid.uuid4().hex[:20]}"

    # Save original image
    image_filename = f"{pred_id}.png"
    image_path = os.path.join(MEDIA_DIR, image_filename)
    image.convert("RGB").save(image_path)

    # Run inference
    try:
        result = predict(image)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "INFERENCE_FAILED", "message": "Model inference failed."}},
        )

    # Generate + save Grad-CAM heatmap
    heatmap_filename = f"{pred_id}_heatmap.png"
    heatmap_path = os.path.join(MEDIA_DIR, heatmap_filename)
    try:
        heatmap_img = generate_gradcam(image)
        heatmap_img.save(heatmap_path)
        heatmap_url = f"/media/{heatmap_filename}"
    except Exception:
        heatmap_url = None  # don't fail the whole request if only Grad-CAM breaks

    prediction = Prediction(
        id=pred_id,
        user_id=current_user.id,
        image_url=f"/media/{image_filename}",
        heatmap_url=heatmap_url,
        predicted_class=result["predicted_class"],
        confidence=result["confidence"],
        class_probabilities_json=json.dumps(result["class_probabilities"]),
    )
    session.add(prediction)
    session.commit()
    session.refresh(prediction)

    return _prediction_to_out(prediction)


@router.get("", response_model=PredictionListOut)
def list_predictions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    defect_class: Optional[str] = None,
    from_date: Optional[datetime] = Query(None, alias="from"),
    to_date: Optional[datetime] = Query(None, alias="to"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = select(Prediction).where(Prediction.user_id == current_user.id)

    if defect_class:
        query = query.where(Prediction.predicted_class == defect_class)
    if from_date:
        query = query.where(Prediction.created_at >= from_date)
    if to_date:
        query = query.where(Prediction.created_at <= to_date)

    count_query = select(func.count()).select_from(query.subquery())
    total = session.exec(count_query).one()

    query = query.order_by(Prediction.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    predictions = session.exec(query).all()

    items = []
    for pred in predictions:
        feedback = session.exec(
            select(Feedback).where(Feedback.prediction_id == pred.id)
        ).first()
        items.append(_prediction_to_out(pred, feedback))

    return PredictionListOut(items=items, page=page, page_size=page_size, total=total)


@router.get("/{prediction_id}", response_model=PredictionOut)
def get_prediction(
    prediction_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    pred = session.get(Prediction, prediction_id)
    if not pred or pred.user_id != current_user.id:
        raise HTTPException(
            status_code=404,
            detail={"error": {"code": "NOT_FOUND", "message": "Prediction not found."}},
        )

    feedback = session.exec(
        select(Feedback).where(Feedback.prediction_id == pred.id)
    ).first()

    return _prediction_to_out(pred, feedback)
