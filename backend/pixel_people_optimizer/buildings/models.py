from pixel_people_optimizer.db import Base
from pixel_people_optimizer.models import profession_building
from pixel_people_optimizer.professions.models import Profession
from pixel_people_optimizer.users.models import User
from sqlalchemy import TIMESTAMP, Column, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Building(Base):
    __tablename__ = "buildings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    land_size: Mapped[int]
    coin_output: Mapped[int]
    multiplier: Mapped[float]

    professions: Mapped[list["Profession"]] = relationship(
        secondary=profession_building, back_populates="buildings"
    )
    unlock_professions: Mapped[list["Profession"]] = relationship(
        back_populates="unlock_bldg"
    )


class MyBuilding(Base):
    __tablename__ = "my_buildings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    building_id: Mapped[int] = mapped_column(Integer, ForeignKey("buildings.id"))
    user: Mapped["User"] = relationship(back_populates="my_buildings")
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
