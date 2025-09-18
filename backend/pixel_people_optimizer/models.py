from sqlalchemy import Boolean, Column, ForeignKey, Integer, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

# Association table for many-to-many between Profession and Building
profession_building = Table(
    "profession_building",
    Base.metadata,
    Column("profession_id", Integer, ForeignKey("professions.id"), primary_key=True),
    Column("building_id", Integer, ForeignKey("buildings.id"), primary_key=True),
)


# Association table for many-to-many between Profession and SpecialMission
class SpecialMissionProfession(Base):
    __tablename__ = "special_mission_profession"

    special_mission_id: Mapped[int] = mapped_column(
        ForeignKey("special_missions.id"), primary_key=True
    )
    profession_id: Mapped[int] = mapped_column(
        ForeignKey("professions.id"), primary_key=True
    )
    is_direct: Mapped[bool] = mapped_column(Boolean, default=False)

    mission = relationship("SpecialMission", back_populates="mission_professions")
    profession = relationship("Profession", back_populates="mission_professions")
