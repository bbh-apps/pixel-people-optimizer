from pixel_people_optimizer.db import Base
from pixel_people_optimizer.professions.models import Profession
from pixel_people_optimizer.users.models import User
from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class SpecialMission(Base):
    __tablename__ = "special_missions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    professions: Mapped[list["Profession"]] = relationship(
        back_populates="unlock_mission"
    )
    season: Mapped[str] = mapped_column(String, nullable=True)
    cost: Mapped[str] = mapped_column(String)


class MySpecialMission(Base):
    __tablename__ = "my_special_missions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    mission_id: Mapped[int] = mapped_column(Integer, ForeignKey("special_missions.id"))
    user: Mapped["User"] = relationship(back_populates="my_special_missions")
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
