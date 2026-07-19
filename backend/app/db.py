# app/db.py
import os
from sqlmodel import SQLModel, Session, create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# check_same_thread=False is required for SQLite + FastAPI's threaded requests
connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args) 
# echo =True will log all SQL statements to the console, useful for debugging and default is False. You can set it to True in development and False in production.


def create_db_and_tables():
    """Creates all tables based on SQLModel classes. Call once at startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency — yields a DB session per request."""
    with Session(engine) as session:
        yield session