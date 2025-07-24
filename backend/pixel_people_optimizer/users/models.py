from pixel_people_optimizer.db import Base
from sqlalchemy import TIMESTAMP, Column, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String, primary_key=True
    )  # Use string for auth user id
    email: Mapped[str | None] = mapped_column(String, unique=True, nullable=True)

    # Relationships to user's saved buildings and professions
    my_buildings: Mapped[list["MyBuilding"]] = relationship(
        "MyBuilding", back_populates="user", cascade="all, delete-orphan"
    )
    my_professions: Mapped[list["MyProfession"]] = relationship(
        "MyProfession", back_populates="user", cascade="all, delete-orphan"
    )
    my_special_missions: Mapped[list["MySpecialMission"]] = relationship(
        "MySpecialMission", back_populates="user", cascade="all, delete-orphan"
    )
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
