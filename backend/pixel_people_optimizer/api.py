from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.pixel_people_optimizer.schema import (
    BuildingListRes,
    IDList,
    ProfessionListRes,
    RecommendationRes,
)
from backend.pixel_people_optimizer.service import sync_user_items

from .auth import get_current_user_id
from .db import get_db
from .models import Building, MyBuilding, MyProfession, Profession
from .recommend import recommend_professions

api_router = APIRouter(prefix="/api", tags=["api"])

# --- Public routes ---


@api_router.get("/buildings", response_model=List[BuildingListRes])
def list_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()


@api_router.get("/professions", response_model=List[ProfessionListRes])
def list_professions(db: Session = Depends(get_db)):
    return db.query(Profession).order_by("name").all()


# --- User-specific routes ---


@api_router.get("/me/buildings", response_model=List[BuildingListRes])
def get_user_buildings(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return (
        db.query(Building)
        .join(MyBuilding, Building.id == MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .all()
    )


@api_router.get("/me/professions", response_model=List[ProfessionListRes])
def get_user_professions(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return (
        db.query(Profession)
        .join(MyProfession, Profession.id == MyProfession.profession_id)
        .filter(MyProfession.user_id == user_id)
        .all()
    )


@api_router.post("/buildings", response_model=IDList)
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

    # ORM-style query to get synced building IDs
    saved_ids = (
        db.query(MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .order_by(MyBuilding.building_id)
        .all()
    )
    return IDList(ids=[id_tuple[0] for id_tuple in saved_ids])


@api_router.post("/professions", response_model=IDList)
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

    # ORM-style query to get synced profession IDs
    saved_ids = (
        db.query(MyProfession.profession_id)
        .filter(MyProfession.user_id == user_id)
        .order_by(MyProfession.profession_id)
        .all()
    )
    return IDList(ids=[id_tuple[0] for id_tuple in saved_ids])


@api_router.get("/recommendations", response_model=List[RecommendationRes])
def get_recommendations(
    remaining_land: int,
    request: Request,
    db: Session = Depends(get_db),
):
    auth_header = request.headers.get("authorization")
    if not auth_header:
        user_id = None
    else:

        token = auth_header.removeprefix("Bearer ").strip()
        user_id = get_current_user_id(
            credentials=HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
        )
    recommendations = recommend_professions(
        db, user_id=user_id, remaining_land=remaining_land, limit=None
    )
    return [
        RecommendationRes(
            profession=ProfessionListRes(
                id=rec.profession.id,
                name=rec.profession.name,
                category=rec.profession.category,
            ),
            parent1=(
                None
                if rec.parent1 is None
                else ProfessionListRes(
                    id=rec.parent1.id,
                    name=rec.parent1.name,
                    category=rec.parent1.category,
                )
            ),
            parent2=(
                None
                if rec.parent2 is None
                else ProfessionListRes(
                    id=rec.parent2.id,
                    name=rec.parent2.name,
                    category=rec.parent2.category,
                )
            ),
            unlock_bldg=(
                None
                if rec.unlock_bldg is None
                else BuildingListRes(id=rec.unlock_bldg.id, name=rec.unlock_bldg.name)
            ),
            extra_land_needed=rec.extra_land_needed,
            score=rec.score,
        )
        for rec in recommendations
    ]
