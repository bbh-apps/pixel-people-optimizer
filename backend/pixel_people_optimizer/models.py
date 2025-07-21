from sqlalchemy import (
    TIMESTAMP,
    Column,
    ForeignKey,
    Integer,
    String,
    Table,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

# Association table for many-to-many between Profession and Building
profession_building = Table(
    "profession_building",
    Base.metadata,
    Column("profession_id", Integer, ForeignKey("professions.id"), primary_key=True),
    Column("building_id", Integer, ForeignKey("buildings.id"), primary_key=True),
)


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
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


class Building(Base):
    __tablename__ = "buildings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    land_size: Mapped[int]  # number of land tiles required to build
    coin_output: Mapped[int]
    multiplier: Mapped[float]

    professions: Mapped[list["Profession"]] = relationship(
        secondary=profession_building, back_populates="buildings"
    )


class Profession(Base):
    __tablename__ = "professions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    category: Mapped[str]

    buildings: Mapped[list[Building]] = relationship(
        secondary=profession_building, back_populates="professions"
    )

    unlock_bldg_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("buildings.id"), nullable=True
    )
    unlock_bldg: Mapped[Building | None] = relationship(
        "Building", foreign_keys=[unlock_bldg_id]
    )


class SpliceFormula(Base):
    __tablename__ = "splice_formulas"
    id: Mapped[int] = mapped_column(
        Integer, ForeignKey("professions.id"), primary_key=True
    )
    parent1_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("professions.id"), nullable=True
    )
    parent2_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("professions.id"), nullable=True
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
