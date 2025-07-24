from typing import List

from fastapi import APIRouter, Depends
from pixel_people_optimizer.auth.service import get_current_user_id
from pixel_people_optimizer.buildings.models import Building, MyBuilding
from pixel_people_optimizer.buildings.schema import BuildingListRes
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.lib.sync_user_items import sync_user_items
from pixel_people_optimizer.schema import IDList
from sqlalchemy.orm import Session

router = APIRouter(prefix="/buildings", tags=["buildings"])


@router.get("/", response_model=List[BuildingListRes])
def list_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()


@router.get("/me", response_model=List[BuildingListRes])
def get_user_buildings(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return (
        db.query(Building)
        .join(MyBuilding, Building.id == MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .all()
    )


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

    saved_ids = (
        db.query(MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .order_by(MyBuilding.building_id)
        .all()
    )
    return IDList(ids=[id_tuple[0] for id_tuple in saved_ids])
