from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = Path.home() / ".pixel_people.db"
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False, future=True)
Session = sessionmaker(bind=engine, future=True)
Base = declarative_base()


def init_db() -> None:
    """Create all tables if they don't exist."""
    from . import models  # noqa: F401 – imports models so Base has subclasses

    Base.metadata.create_all(engine)
