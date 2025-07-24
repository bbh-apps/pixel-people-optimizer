from typing import List

from pixel_people_optimizer.lib.schema import BaseEntityRes


class MissionListRes(BaseEntityRes):
    pass


class MissionListWithDetailRes(BaseEntityRes):
    cost: str
    professions: List["ProfessionListRes"]


from pixel_people_optimizer.professions.schema import ProfessionListRes

MissionListWithDetailRes.model_rebuild()
