from sqlalchemy import Column, ForeignKey, Integer, String, Table, UniqueConstraint
from sqlalchemy.orm import Mapped, relationship

from .db import Base

# Association table for many-to-many between Profession and Building
profession_building = Table(
    "profession_building",
    Base.metadata,
    Column("profession_id", Integer, ForeignKey("professions.id"), primary_key=True),
    Column("building_id", Integer, ForeignKey("buildings.id"), primary_key=True),
)


class Building(Base):
    __tablename__ = "buildings"
    id: Mapped[int] = Column(Integer, primary_key=True)
    name: Mapped[str] = Column(String, unique=True)
    land_size: Mapped[int]  # number of land tiles required to build
    coin_output: Mapped[int]
    multiplier: Mapped[float]

    professions: Mapped[list["Profession"]] = relationship(
        secondary=profession_building, back_populates="buildings"
    )


class Profession(Base):
    __tablename__ = "professions"
    id: Mapped[int] = Column(Integer, primary_key=True)
    name: Mapped[str] = Column(String, unique=True)
    category: Mapped[str]

    buildings: Mapped[list[Building]] = relationship(
        secondary=profession_building, back_populates="professions"
    )

    unlock_bldg: Mapped[int] = Column(
        Integer, ForeignKey("buildings.id"), nullable=True
    )


class SpliceFormula(Base):
    __tablename__ = "splice_formulas"
    id: Mapped[int] = Column(Integer, ForeignKey("professions.id"), primary_key=True)
    parent1_id: Mapped[int | None] = Column(
        Integer, ForeignKey("professions.id"), nullable=True
    )
    parent2_id: Mapped[int | None] = Column(
        Integer, ForeignKey("professions.id"), nullable=True
    )


class MyBuilding(Base):
    __tablename__ = "my_buildings"
    id: Mapped[int] = Column(Integer, primary_key=True)
    building_id: Mapped[int] = Column(Integer, ForeignKey("buildings.id"), unique=True)


class MyProfession(Base):
    __tablename__ = "my_professions"
    id: Mapped[int] = Column(Integer, primary_key=True)
    profession_id: Mapped[int] = Column(
        Integer, ForeignKey("professions.id"), unique=True
    )

    __table_args__ = (UniqueConstraint("profession_id", name="uix_profession_id"),)
