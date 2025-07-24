from typing import Optional

from pixel_people_optimizer.db import Base
from pixel_people_optimizer.models import profession_building
from pixel_people_optimizer.users.models import User
from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Profession(Base):
    __tablename__ = "professions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    category: Mapped[str]

    buildings: Mapped[list["Building"]] = relationship(
        secondary=profession_building, back_populates="professions"
    )

    unlock_mission_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("special_missions.id"), nullable=True
    )
    unlock_mission: Mapped[Optional["SpecialMission"]] = relationship(
        back_populates="professions"
    )

    unlock_bldg_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("buildings.id"), nullable=True
    )
    unlock_bldg: Mapped[Optional["Building"]] = relationship(
        "Building", foreign_keys=[unlock_bldg_id]
    )

    formula: Mapped[Optional["SpliceFormula"]] = relationship(
        back_populates="profession", foreign_keys="[SpliceFormula.id]"
    )


class MyProfession(Base):
    __tablename__ = "my_professions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    profession_id: Mapped[int] = mapped_column(Integer, ForeignKey("professions.id"))
    user: Mapped["User"] = relationship(back_populates="my_professions")
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
