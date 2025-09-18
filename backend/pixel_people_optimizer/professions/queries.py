from typing import Dict, List, Set

from pixel_people_optimizer.formulas.models import SpliceFormula
from pixel_people_optimizer.missions.models import MySpecialMission
from pixel_people_optimizer.models import SpecialMissionProfession
from pixel_people_optimizer.professions.models import MyProfession, Profession
from sqlalchemy import func, select
from sqlalchemy.orm import Session, aliased, selectinload

parent1 = aliased(Profession)
parent2 = aliased(Profession)
my_mission = aliased(MySpecialMission)
user_prof = aliased(MyProfession)
user_parent1 = aliased(MyProfession)
user_parent2 = aliased(MyProfession)


def get_all_professions(db: Session) -> List[Profession]:
    stmt = (
        select(Profession)
        .options(
            selectinload(Profession.formula).selectinload(SpliceFormula.parent1),
            selectinload(Profession.formula).selectinload(SpliceFormula.parent2),
            selectinload(Profession.mission_professions).selectinload(
                SpecialMissionProfession.mission
            ),
            selectinload(Profession.unlock_mission),
            selectinload(Profession.unlock_bldg),
        )
        .order_by(Profession.id)
    )
    return db.execute(stmt).scalars().all()


def get_user_unlocked_professions(user_id: int):
    return (
        select(MyProfession.profession_id)
        .where(MyProfession.user_id == user_id)
        .subquery()
    )


def get_unlocked_profession_ids(user_id: int, db: Session) -> Set[int]:
    subq = get_user_unlocked_professions(user_id)
    return set(db.execute(select(subq.c.profession_id)).scalars())


def get_user_professions(user_id: int, db: Session) -> List[Profession]:
    subq = get_user_unlocked_professions(user_id)
    return db.execute(select(Profession).where(Profession.id.in_(subq))).scalars().all()


def get_profession_by_id(profession_id: int, db: Session):
    return db.query(Profession).filter(Profession.id == profession_id).first()


def get_completed_mission_ids(user_id: int, db: Session) -> Set[int]:
    return set(
        db.execute(
            select(MySpecialMission.mission_id).where(
                MySpecialMission.user_id == user_id
            )
        ).scalars()
    )


def get_recipe_unlock_counts(db: Session) -> Dict[int, int]:
    return dict(
        db.execute(
            select(
                SpecialMissionProfession.special_mission_id,
                func.count(SpecialMissionProfession.profession_id),
            ).group_by(SpecialMissionProfession.special_mission_id)
        ).all()
    )
