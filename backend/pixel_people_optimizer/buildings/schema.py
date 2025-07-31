from typing import List

from pixel_people_optimizer.lib.schema import BaseEntityRes
from pixel_people_optimizer.professions.schema import ProfessionListRes


class BuildingProfessionRes(ProfessionListRes):
    is_unlocked: bool
    is_unlock_bldg: bool


class BuildingListRes(BaseEntityRes):
    pass


class BuildingListWithDetailRes(BuildingListRes):
    land_cost: int
    max_cps: int
    professions: List[BuildingProfessionRes]
