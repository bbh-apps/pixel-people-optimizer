from typing import List

from fastapi import APIRouter, Depends
from gotrue import Session
from pixel_people_optimizer.auth.service import get_current_user_id
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.lib.sync_user_items import sync_user_items
from pixel_people_optimizer.missions import queries as mission_queries
from pixel_people_optimizer.missions.models import MySpecialMission, SpecialMission
from pixel_people_optimizer.missions.schema import (
    MissionListRes,
    MissionListWithDetailRes,
    SaveMissionRes,
)
from pixel_people_optimizer.professions import queries as prof_queries
from pixel_people_optimizer.professions.models import MyProfession, Profession
from pixel_people_optimizer.schema import IDList
from sqlalchemy.orm import Session

router = APIRouter(prefix="/missions", tags=["missions"])


@router.get("/", response_model=List[MissionListWithDetailRes])
def list_missions(db: Session = Depends(get_db)):
    return mission_queries.get_all_missions(db)


@router.get("/me", response_model=List[MissionListRes])
def get_user_missions(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return mission_queries.get_user_completed_missions(user_id, db)


@router.post("/me", response_model=SaveMissionRes)
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

    saved_missions = mission_queries.get_user_completed_missions(user_id, db)
    saved_professions = prof_queries.get_user_professions(user_id, db)
    saved_professions_ids = [p.id for p in saved_professions]
    for mission in saved_missions:
        professions = mission.professions
        for prof in professions:
            if prof.category == "Special":
                saved_professions_ids.append(prof.id)

    sync_user_items(
        user_id=user_id,
        db=db,
        payload=IDList(ids=saved_professions_ids),
        item_model=Profession,
        link_model=MyProfession,
        link_field="profession_id",
    )

    saved_professions = prof_queries.get_user_professions(user_id, db)

    return SaveMissionRes(
        missions=[m.id for m in saved_missions],
        professions=[p.id for p in saved_professions],
    )
