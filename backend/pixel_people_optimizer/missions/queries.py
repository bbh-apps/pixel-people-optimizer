from typing import List

from pixel_people_optimizer.missions.models import MySpecialMission, SpecialMission
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload


def get_all_missions(db: Session):
    return (
        db.query(SpecialMission)
        .options(selectinload(SpecialMission.professions))
        .order_by("name")
        .all()
    )


def get_user_completed_missions_subq(user_id: int, db: Session):
    return (
        db.query(SpecialMission)
        .join(MySpecialMission, SpecialMission.id == MySpecialMission.mission_id)
        .filter(MySpecialMission.user_id == user_id)
        .subquery()
    )


def get_user_completed_missions(user_id: int, db: Session) -> List[SpecialMission]:
    subquery = get_user_completed_missions_subq(user_id, db)
    return (
        db.query(SpecialMission)
        .options(selectinload(SpecialMission.professions))
        .from_statement(select(subquery))
        .all()
    )
