from sqlmodel import Session, select
from app.db import engine, create_db_and_tables
from app.models import User

DEMO_USERS = [
    {"email": "engineer@fab.com", "password": "password123", "name": "Demo Engineer"},
]


def seed_users():
    create_db_and_tables()

    with Session(engine) as session:
        for u in DEMO_USERS:
            existing = session.exec(select(User).where(User.email == u["email"])).first()
            if existing:
                print(f"Skipped (already exists): {u['email']}")
                continue

            user = User(email=u["email"], password=u["password"], name=u["name"])
            session.add(user)
            session.commit()
            print(f"Created user: {u['email']} (id={user.id})")


if __name__ == "__main__":
    seed_users()