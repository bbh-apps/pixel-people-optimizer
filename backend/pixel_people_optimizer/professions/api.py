from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pixel_people_optimizer.auth.service import (
    get_current_user_id,
    get_current_user_id_optional,
)
from pixel_people_optimizer.buildings import queries as bldg_queries
from pixel_people_optimizer.buildings.models import Building, MyBuilding
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.formulas.models import SpliceFormula
from pixel_people_optimizer.lib.sync_user_items import sync_user_items
from pixel_people_optimizer.professions import queries as prof_queries
from pixel_people_optimizer.professions import service as prof_service
from pixel_people_optimizer.professions.models import MyProfession, Profession
from pixel_people_optimizer.professions.schema import (
    ProfessionListRes,
    ProfessionListWithDetailRes,
    ProfessionPathsRes,
    SaveProfessionReq,
    SaveProfessionRes,
)
from pixel_people_optimizer.schema import IDList
from sqlalchemy.orm import Session

router = APIRouter(prefix="/professions", tags=["professions"])


@router.get("/", response_model=List[ProfessionListWithDetailRes])
def list_professions(
    user_id: int | None = Depends(get_current_user_id_optional),
    db: Session = Depends(get_db),
):
    return prof_service.get_all_professions_with_user_data(user_id, db)


@router.get("/{id:int}/paths", response_model=ProfessionPathsRes)
def get_paths_to_profession(id: int, db: Session = Depends(get_db)):
    if not prof_queries.get_profession_by_id(profession_id=id, db=db):
        raise HTTPException(status_code=404, detail="Profession not found")

    splice_formulas = db.query(SpliceFormula).all()
    reverse_graph = prof_service.build_reverse_graph(splice_formulas=splice_formulas)
    shortest_paths = prof_service.compute_shortest_paths_to_target(
        target_profession_id=id, reverse_graph=reverse_graph
    )
    return ProfessionPathsRes(paths=shortest_paths)


@router.get("/me", response_model=List[ProfessionListRes])
def get_user_professions(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return prof_queries.get_user_professions(user_id, db)


@router.post("/me", response_model=SaveProfessionRes)
def sync_user_professions(
    payload: SaveProfessionReq,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    sync_user_items(
        user_id=user_id,
        db=db,
        payload=IDList(ids=payload.ids),
        item_model=Profession,
        link_model=MyProfession,
        link_field="profession_id",
    )

    saved_professions = prof_queries.get_user_professions(user_id, db)
    saved_buildings = None

    if payload.include_buildings:
        saved_buildings = bldg_queries.get_user_buildings(user_id, db)
        saved_buildings_ids = [b.id for b in saved_buildings]
        buildings_to_save = [
            p.unlock_bldg_id for p in saved_professions if p.unlock_bldg_id is not None
        ]
        buildings_to_save = list(set(saved_buildings_ids + buildings_to_save))

        sync_user_items(
            user_id=user_id,
            db=db,
            payload=IDList(ids=buildings_to_save),
            item_model=Building,
            link_model=MyBuilding,
            link_field="building_id",
        )

        saved_buildings = bldg_queries.get_user_buildings(user_id, db)

    return SaveProfessionRes(
        professions=[p.id for p in saved_professions],
        buildings=(
            [b.id for b in saved_buildings] if payload.include_buildings else None
        ),
    )
