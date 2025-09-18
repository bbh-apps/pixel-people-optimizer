from typing import List

from pixel_people_optimizer.lib.schema import BaseEntityRes
from pydantic import BaseModel


class MissionListRes(BaseEntityRes):
    pass


class MissionListWithDetailRes(BaseEntityRes):
    cost: str
    professions: List["ProfessionListRes"]


class SaveMissionRes(BaseModel):
    missions: List[int]
    professions: List[int]


from pixel_people_optimizer.professions.schema import ProfessionListRes  # noqa: E402

MissionListWithDetailRes.model_rebuild()
