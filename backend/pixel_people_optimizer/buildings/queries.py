from typing import List

from pixel_people_optimizer.buildings.models import Building, MyBuilding
from pixel_people_optimizer.buildings.schema import BuildingListRes
from sqlalchemy.orm import Session, selectinload


def get_all_buildings(db: Session):
    return (
        db.query(Building)
        .options(
            selectinload(Building.professions),
            selectinload(Building.unlock_professions),
        )
        .all()
    )


def get_user_unlocked_buildings(user_id: int, db: Session):
    return (
        db.query(MyBuilding.building_id)
        .filter(MyBuilding.user_id == user_id)
        .subquery()
    )


def get_user_buildings(user_id: int, db: Session) -> List[BuildingListRes]:
    subquery = get_user_unlocked_buildings(user_id, db)
    return db.query(Building).filter(Building.id.in_(subquery)).all()
