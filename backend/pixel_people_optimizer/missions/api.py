from typing import List

from fastapi import APIRouter, Depends
from gotrue import Session
from pixel_people_optimizer.auth.service import get_current_user_id
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.lib.sync_user_items import sync_user_items
from pixel_people_optimizer.missions.models import MySpecialMission, SpecialMission
from pixel_people_optimizer.missions.schema import (
    MissionListRes,
    MissionListWithDetailRes,
)
from pixel_people_optimizer.schema import IDList
from sqlalchemy.orm import Session, joinedload

router = APIRouter(prefix="/missions", tags=["missions"])


@router.get("/", response_model=List[MissionListWithDetailRes])
def list_missions(db: Session = Depends(get_db)):
    return (
        db.query(SpecialMission)
        .options(joinedload(SpecialMission.professions))
        .order_by("name")
        .all()
    )


@router.get("/me", response_model=List[MissionListRes])
def get_user_missions(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return (
        db.query(SpecialMission)
        .join(MySpecialMission, SpecialMission.id == MySpecialMission.mission_id)
        .filter(MySpecialMission.user_id == user_id)
        .all()
    )


@router.post("/me", response_model=IDList)
def sync_user_missions(
    payload: IDList,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    sync_user_items(
        user_id=user_id,
        db=db,
        payload=payload,
        item_model=SpecialMission,
        link_model=MySpecialMission,
        link_field="mission_id",
    )

    saved_ids = (
        db.query(MySpecialMission.mission_id)
        .filter(MySpecialMission.user_id == user_id)
        .order_by(MySpecialMission.mission_id)
        .all()
    )
    return IDList(ids=[id_tuple[0] for id_tuple in saved_ids])
