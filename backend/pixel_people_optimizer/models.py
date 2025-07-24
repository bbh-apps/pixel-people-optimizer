from sqlalchemy import Column, ForeignKey, Integer, Table

from .db import Base

# Association table for many-to-many between Profession and Building
profession_building = Table(
    "profession_building",
    Base.metadata,
    Column("profession_id", Integer, ForeignKey("professions.id"), primary_key=True),
    Column("building_id", Integer, ForeignKey("buildings.id"), primary_key=True),
)
