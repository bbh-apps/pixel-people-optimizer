from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .auth import get_current_user_id
from .db import SessionLocal
from .models import Building, MyBuilding, MyProfession, Profession
from .recommend import recommend_professions

api_router = APIRouter(prefix="/api", tags=["api"])


# Pydantic response models
class BuildingOut(BaseModel):
    id: int
    name: str
    land_size: int
    multiplier: int
    coin_output: int

    class Config:
        orm_mode = True


class ProfessionOut(BaseModel):
    id: int
    name: str
    category: str

    class Config:
        orm_mode = True


class IDList(BaseModel):
    ids: List[int]


# Dependency


def get_db():
    db = Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- Public routes ---


@api_router.get("/buildings", response_model=List[BuildingOut])
def list_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()


@api_router.get("/professions", response_model=List[ProfessionOut])
def list_professions(db: Session = Depends(get_db)):
    return db.query(Profession).all()


# --- User-specific routes ---


@api_router.get("/me/buildings", response_model=List[BuildingOut])
def get_user_buildings(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return (
        db.query(Building)
        .join(MyBuilding, Building.id == MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .all()
    )


@api_router.get("/me/professions", response_model=List[ProfessionOut])
def get_user_professions(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    return (
        db.query(Profession)
        .join(MyProfession, Profession.id == MyProfession.profession_id)
        .filter(MyProfession.user_id == user_id)
        .all()
    )


@api_router.post("/me/buildings")
def add_user_buildings(
    payload: IDList,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    for building_id in payload.ids:
        if not db.query(Building).filter_by(id=building_id).first():
            raise HTTPException(
                status_code=404, detail=f"Building ID {building_id} not found"
            )
        if (
            not db.query(MyBuilding)
            .filter_by(user_id=user_id, building_id=building_id)
            .first()
        ):
            db.add(MyBuilding(user_id=user_id, building_id=building_id))
    db.commit()
    return {"message": "Buildings saved."}


@api_router.post("/me/professions")
def add_user_professions(
    payload: IDList,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    for profession_id in payload.ids:
        if not db.query(Profession).filter_by(id=profession_id).first():
            raise HTTPException(
                status_code=404, detail=f"Profession ID {profession_id} not found"
            )
        if (
            not db.query(MyProfession)
            .filter_by(user_id=user_id, profession_id=profession_id)
            .first()
        ):
            db.add(MyProfession(user_id=user_id, profession_id=profession_id))
    db.commit()
    return {"message": "Professions saved."}


@api_router.get("/recommendations")
def get_recommendations(
    land: int,
    limit: int = 10,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    return recommend_professions(db, user_id=user_id, remaining_land=land, limit=limit)
