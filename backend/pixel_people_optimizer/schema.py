from typing import List

from pydantic import BaseModel


class BuildingListRes(BaseModel):
    id: int
    name: str


class ProfessionListRes(BaseModel):
    id: int
    name: str
    category: str


class IDList(BaseModel):
    ids: List[int]


class OTPReq(BaseModel):
    email: str


class RecommendationRes(BaseModel):
    profession: ProfessionListRes
    parent1: ProfessionListRes | None
    parent2: ProfessionListRes | None
    unlock_bldg: BuildingListRes | None
    extra_land_needed: int
    score: float
