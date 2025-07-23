from typing import List

from pydantic import BaseModel


class VerifiedUserRes(BaseModel):
    email: str
    is_new_account: bool


class BaseEntityRes(BaseModel):
    id: int
    name: str


class BuildingListRes(BaseEntityRes):
    pass


class MissionListRes(BaseEntityRes):
    pass


class ProfessionListRes(BaseEntityRes):
    category: str


class ProfessionListWithMissionRes(ProfessionListRes):
    category: str
    mission: MissionListRes | None
    formula: List[ProfessionListRes] | None


class SavedProfessionListRes(ProfessionListRes):
    category: str
    mission: MissionListRes | None


class IDList(BaseModel):
    ids: List[int]


class OTPReq(BaseModel):
    email: str


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
