from typing import List

from pixel_people_optimizer.lib.schema import BaseEntityRes
from pydantic import BaseModel


class ProfessionListRes(BaseEntityRes):
    category: str


class SavedProfessionMissionRes(BaseModel):
    name: str
    is_complete: bool


class SavedProfessionFormulaRes(ProfessionListRes):
    is_unlocked: bool


class ProfessionListWithDetailRes(ProfessionListRes):
    category: str
    mission: SavedProfessionMissionRes | None
    formula: List[SavedProfessionFormulaRes] | None


class SavedProfessionListRes(ProfessionListRes):
    category: str
    mission: SavedProfessionMissionRes | None
    formula: List[SavedProfessionFormulaRes]


class ProfessionPathsRes(BaseModel):
    paths: list[list[int]]
