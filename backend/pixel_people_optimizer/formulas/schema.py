from typing import List

from pydantic import BaseModel


class ProfessionGraphEdge(BaseModel):
    id: str
    source_id: int | None
    target_id: int


class ProfessionGraph(BaseModel):
    edges: List[ProfessionGraphEdge]
