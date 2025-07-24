from typing import List

from pixel_people_optimizer.professions.schema import ProfessionListRes
from pydantic import BaseModel


class UnlockBuildingRes(BaseModel):
    id: int
    name: str
    professions: List[ProfessionListRes]


class RecommendationRes(BaseModel):
    profession: ProfessionListRes
    parent1: ProfessionListRes | None
    parent2: ProfessionListRes | None
    unlock_bldg: UnlockBuildingRes | None
    unlock_professions: List[ProfessionListRes]
    extra_land_needed: int
    max_cps: int
