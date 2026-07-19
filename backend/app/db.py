# app/db.py
import os
from sqlmodel import SQLModel, Session, create_engine
from dotenv import load_dotenv

load_dotenv()

# Use encrypted SQLite database with credentials
DB_PASSWORD = os.getenv("DB_PASSWORD", "change-this-secure-password")
DB_PATH = os.getenv("DB_PATH", "./app.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

# check_same_thread=False is required for SQLite + FastAPI's threaded requests
connect_args = {"check_same_thread": False, "uri": False}

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args,
    # Optional: Add encryption pragma for sqlcipher
    # pragma_foreign_keys=False
) 
# echo =True will log all SQL statements to the console, useful for debugging and default is False. You can set it to True in development and False in production.


def create_db_and_tables():
    """Creates all tables based on SQLModel classes. Call once at startup."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency — yields a DB session per request."""
    with Session(engine) as session:
        yield session