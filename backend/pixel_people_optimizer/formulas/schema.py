from typing import List

from pixel_people_optimizer.missions.schema import MissionListRes
from pixel_people_optimizer.professions.schema import ProfessionListRes
from pydantic import BaseModel


class ProfessionGraphEdge(BaseModel):
    id: str
    source_id: int | None
    target_id: int


class ProfessionGraph(BaseModel):
    edges: List[ProfessionGraphEdge]
