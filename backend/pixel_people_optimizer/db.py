import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv()

SUPABASE_DB_URL = os.getenv("SUPABASE_DB_URL")
if not SUPABASE_DB_URL:
    raise RuntimeError("Missing SUPABASE_DB_URL in .env")

engine = create_engine(SUPABASE_DB_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine, future=True)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from . import models  # Ensures all models are loaded

    Base.metadata.create_all(engine)


def get_db():
    db = Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
