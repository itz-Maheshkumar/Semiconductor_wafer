# app/models/__init__.py
from app.models.user import User
from app.models.prediction import Prediction
from app.models.feedback import Feedback

__all__ = ["User", "Prediction", "Feedback"]