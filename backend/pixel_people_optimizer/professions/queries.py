from typing import List

from pixel_people_optimizer.formulas.models import SpliceFormula
from pixel_people_optimizer.missions import queries as mission_queries
from pixel_people_optimizer.missions.models import MySpecialMission, SpecialMission
from pixel_people_optimizer.professions.models import MyProfession, Profession
from pixel_people_optimizer.professions.schema import (
    ProfessionListRes,
    ProfessionListWithDetailRes,
    SavedProfessionFormulaRes,
    SavedProfessionMissionRes,
)
from sqlalchemy import case, select
from sqlalchemy.orm import Session, aliased, selectinload

parent1 = aliased(Profession)
parent2 = aliased(Profession)
my_mission = aliased(MySpecialMission)
user_prof = aliased(MyProfession)
user_parent1 = aliased(MyProfession)
user_parent2 = aliased(MyProfession)


def get_user_unlocked_professions(user_id: int, db: Session):
    return (
        db.query(MyProfession.profession_id)
        .filter(MyProfession.user_id == user_id)
        .subquery()
    )


def get_all_professions(db: Session):
    stmt = (
        select(Profession)
        .join(SpliceFormula, SpliceFormula.id == Profession.id, isouter=True)
        .options(
            selectinload(Profession.formula).selectinload(SpliceFormula.parent1),
            selectinload(Profession.formula).selectinload(SpliceFormula.parent2),
            selectinload(Profession.unlock_mission),
        )
        .order_by(Profession.id)
    )
    return db.execute(stmt).scalars().all()


def get_user_professions(user_id: int, db: Session) -> List[ProfessionListRes]:
    subquery = get_user_unlocked_professions(user_id, db)
    return db.query(Profession).filter(Profession.id.in_(subquery)).all()
