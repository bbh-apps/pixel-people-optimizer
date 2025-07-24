from typing import Optional

from pixel_people_optimizer.db import Base
from pixel_people_optimizer.professions.models import Profession
from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship


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
    parent1: Mapped[Optional["Profession"]] = relationship(foreign_keys=[parent1_id])
    parent2: Mapped[Optional["Profession"]] = relationship(foreign_keys=[parent2_id])

    profession: Mapped["Profession"] = relationship(
        back_populates="formula", foreign_keys=[id]
    )
