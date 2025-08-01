from typing import List

from fastapi import APIRouter, Depends
from pixel_people_optimizer.auth.service import (
    get_current_user_id,
    get_current_user_id_optional,
)
from pixel_people_optimizer.buildings import queries, service
from pixel_people_optimizer.buildings.models import Building, MyBuilding
from pixel_people_optimizer.buildings.schema import (
    BuildingListRes,
    BuildingListWithDetailRes,
)
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.lib.sync_user_items import sync_user_items
from pixel_people_optimizer.schema import IDList
from sqlalchemy.orm import Session, selectinload

router = APIRouter(prefix="/buildings", tags=["buildings"])


@router.get("/", response_model=List[BuildingListWithDetailRes])
def list_buildings(
    user_id: int | None = Depends(get_current_user_id_optional),
    db: Session = Depends(get_db),
):
    return service.get_all_buildings_with_user_data(user_id=user_id, db=db)


@router.get("/me", response_model=List[BuildingListRes])
def get_user_buildings(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return queries.get_user_buildings(user_id, db)


@router.post("/me", response_model=IDList)
def sync_user_buildings(
    payload: IDList,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    sync_user_items(
        user_id=user_id,
        db=db,
        payload=payload,
        item_model=Building,
        link_model=MyBuilding,
        link_field="building_id",
    )

    saved_buildings = queries.get_user_buildings(user_id=user_id, db=db)
    return IDList(ids=[b.id for b in saved_buildings])
