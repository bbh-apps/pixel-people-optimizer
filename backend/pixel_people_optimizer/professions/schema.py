from typing import List

from pixel_people_optimizer.lib.schema import BaseEntityRes, IDList
from pydantic import BaseModel


class ProfessionListRes(BaseEntityRes):
    category: str


class SaveProfessionReq(IDList):
    include_buildings: bool = False


class SaveProfessionRes(BaseModel):
    professions: List[int]
    buildings: List[int] | None = None


class SavedProfessionMissionRes(BaseModel):
    name: str
    is_complete: bool


class SavedProfessionFormulaRes(ProfessionListRes):
    is_unlocked: bool


class ProfessionListWithDetailRes(ProfessionListRes):
    category: str
    mission: SavedProfessionMissionRes | None
    formula: List[SavedProfessionFormulaRes] | None
    unlock_bldg: str | None


class SavedProfessionListRes(ProfessionListRes):
    category: str
    mission: SavedProfessionMissionRes | None
    formula: List[SavedProfessionFormulaRes]


class ProfessionPathsRes(BaseModel):
    paths: list[list[int]]
