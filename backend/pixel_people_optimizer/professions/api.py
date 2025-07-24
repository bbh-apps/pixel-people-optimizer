from typing import List

from fastapi import APIRouter, Depends
from pixel_people_optimizer.auth.service import (
    get_current_user_id,
    get_current_user_id_optional,
)
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.lib.sync_user_items import sync_user_items
from pixel_people_optimizer.professions import queries, service
from pixel_people_optimizer.professions.models import MyProfession, Profession
from pixel_people_optimizer.professions.schema import (
    ProfessionListRes,
    ProfessionListWithDetailRes,
)
from pixel_people_optimizer.schema import IDList
from sqlalchemy.orm import Session

router = APIRouter(prefix="/professions", tags=["professions"])


@router.get("/", response_model=List[ProfessionListWithDetailRes])
def list_professions(
    user_id: int | None = Depends(get_current_user_id_optional),
    db: Session = Depends(get_db),
):
    return service.get_all_professions_with_user_data(user_id, db)


@router.get("/me", response_model=List[ProfessionListRes])
def get_user_professions(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return queries.get_user_professions(user_id, db)


@router.post("/me", response_model=IDList)
def sync_user_professions(
    payload: IDList,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    sync_user_items(
        user_id=user_id,
        db=db,
        payload=payload,
        item_model=Profession,
        link_model=MyProfession,
        link_field="profession_id",
    )

    saved_ids = (
        db.query(MyProfession.profession_id)
        .filter(MyProfession.user_id == user_id)
        .order_by(MyProfession.profession_id)
        .all()
    )
    return IDList(ids=[id_tuple[0] for id_tuple in saved_ids])
