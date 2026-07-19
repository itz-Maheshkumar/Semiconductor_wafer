# seed.py — extend what you already have
import json
import uuid
import numpy as np
from PIL import Image
from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models import User, Prediction
from app.ml.inference import predict

DEMO_USERS = [
    {"email": "engineer@fab.com", "password": "password123", "name": "Demo Engineer"},
]


def seed_users(session: Session):
    for u in DEMO_USERS:
        existing = session.exec(select(User).where(User.email == u["email"])).first()
        if existing:
            print(f"Skipped (already exists): {u['email']}")
            continue
        user = User(email=u["email"], password=u["password"], name=u["name"])
        session.add(user)
        session.commit()
        print(f"Created user: {u['email']} (id={user.id})")


def seed_predictions(session: Session, count: int = 5):
    user = session.exec(select(User).where(User.email == DEMO_USERS[0]["email"])).first()
    if not user:
        print("No demo user found, skipping prediction seeding.")
        return

    existing_count = session.exec(
        select(Prediction).where(Prediction.user_id == user.id)
    ).all()
    if len(existing_count) >= count:
        print(f"Already have {len(existing_count)} predictions for demo user, skipping.")
        return

    for i in range(count):
        dummy = Image.fromarray((np.random.rand(64, 64) * 255).astype("uint8"), mode="L")
        result = predict(dummy)

        pred_id = f"pred_{uuid.uuid4().hex[:20]}"
        image_path = f"app/media/{pred_id}.png"
        dummy.convert("RGB").save(image_path)

        prediction = Prediction(
            id=pred_id,
            user_id=user.id,
            image_url=f"/media/{pred_id}.png",
            heatmap_url=None,  # skip heatmap generation for seed speed
            predicted_class=result["predicted_class"],
            confidence=result["confidence"],
            class_probabilities_json=json.dumps(result["class_probabilities"]),
        )
        session.add(prediction)
        session.commit()
        print(f"Seeded prediction {pred_id} -> {result['predicted_class']}")


if __name__ == "__main__":
    create_db_and_tables()
    with Session(engine) as session:
        seed_users(session)
        seed_predictions(session, count=5)
        