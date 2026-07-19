from sqlmodel import Session, select

from app.db import engine
from app.models import User


def seed_demo_data():
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.email == "engineer@fab.com")).first()
        if existing:
            return

        demo_user = User(
            email="engineer@fab.com",
            password="password123",
            name="Demo Engineer",
        )
        session.add(demo_user)
        session.commit()
        session.refresh(demo_user)
        print("Seeded demo user engineer@fab.com / password123")
