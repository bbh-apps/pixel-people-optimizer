from fastapi import APIRouter, Depends
from pixel_people_optimizer.auth.service import get_current_user_id
from pixel_people_optimizer.buildings.models import Building, MyBuilding
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.missions.models import MySpecialMission, SpecialMission
from pixel_people_optimizer.professions.models import MyProfession, Profession
from pixel_people_optimizer.users.schema import UserSavedItemCountRes
from sqlalchemy.orm import Session

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/saved_count", response_model=UserSavedItemCountRes)
def get_user_saved_items_count(
    user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    buildings_count = (
        db.query(Building)
        .join(MyBuilding, Building.id == MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .count()
    )

    professions_count = (
        db.query(Profession)
        .join(MyProfession, Profession.id == MyProfession.profession_id)
        .filter(MyProfession.user_id == user_id)
        .count()
    )

    missions_count = (
        db.query(SpecialMission)
        .join(MySpecialMission, SpecialMission.id == MySpecialMission.mission_id)
        .filter(MySpecialMission.user_id == user_id)
        .count()
    )

    return UserSavedItemCountRes(
        buildings_count=buildings_count,
        professions_count=professions_count,
        missions_count=missions_count,
    )
