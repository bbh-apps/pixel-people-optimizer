from typing import List

from pydantic import BaseModel


class BaseEntityRes(BaseModel):
    id: int
    name: str


class IDList(BaseModel):
    ids: List[int]
