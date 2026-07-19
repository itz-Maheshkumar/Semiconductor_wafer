import os
from datetime import datetime, timezone
from sqlmodel import Session, select

from app.db import engine, DB_PATH
from app.models import User, Prediction, Feedback
from app.core.password import hash_password


def seed_demo_data():
    """Seed demo data if database is new (doesn't exist yet)"""
    db_exists = os.path.exists(DB_PATH)
    
    if db_exists:
        # Check if data already exists
        with Session(engine) as session:
            existing = session.exec(select(User).where(User.email == "engineer@fab.com")).first()
            if existing:
                return  # Data already seeded

    with Session(engine) as session:
        # Seed demo users
        demo_user = User(
            email="engineer@fab.com",
            password=hash_password("password123"),
            name="Demo Engineer",
        )
        session.add(demo_user)
        session.commit()
        session.refresh(demo_user)
        print(f"✓ Seeded demo user: engineer@fab.com / password123")

        # Seed additional users for testing
        test_user = User(
            email="test@fab.com",
            password=hash_password("test123"),
            name="Test User",
        )
        session.add(test_user)
        session.commit()
        session.refresh(test_user)
        print(f"✓ Seeded test user: test@fab.com / test123")
