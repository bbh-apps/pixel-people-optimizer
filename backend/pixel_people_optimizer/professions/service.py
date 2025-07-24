from typing import Any, List

from pixel_people_optimizer.missions import queries as mission_queries
from pixel_people_optimizer.professions.schema import (
    ProfessionListWithDetailRes,
    SavedProfessionFormulaRes,
    SavedProfessionMissionRes,
)
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import queries as profession_queries


def get_all_professions_with_user_data(
    user_id: int | None, db: Session
) -> List[ProfessionListWithDetailRes]:
    unlocked_subq = (
        profession_queries.get_user_unlocked_professions(user_id, db)
        if user_id
        else None
    )
    completed_missions_subq = (
        mission_queries.get_user_completed_missions(user_id, db) if user_id else None
    )
    professions = profession_queries.get_all_professions(db)

    unlocked_ids = set()
    completed_mission_ids = set()

    if unlocked_subq is not None:
        unlocked_ids = {
            row[0] for row in db.execute(select(unlocked_subq.c.profession_id))
        }

    if completed_missions_subq is not None:
        completed_mission_ids = {
            row[0] for row in db.execute(select(completed_missions_subq.c.id))
        }

    result = []
    for prof in professions:
        mission = None
        if prof.unlock_mission:
            mission = SavedProfessionMissionRes(
                name=prof.unlock_mission.name,
                is_complete=(
                    (prof.unlock_mission.id in completed_mission_ids)
                    if user_id
                    else False
                ),
            )

        formula = []
        if prof.formula:
            for parent in [prof.formula.parent1, prof.formula.parent2]:
                if parent:
                    formula.append(
                        SavedProfessionFormulaRes(
                            id=parent.id,
                            name=parent.name,
                            category=parent.category,
                            is_unlocked=(
                                (parent.id in unlocked_ids) if user_id else False
                            ),
                        )
                    )

        result.append(
            ProfessionListWithDetailRes(
                id=prof.id,
                name=prof.name,
                category=prof.category,
                mission=mission,
                formula=formula if formula else None,
            )
        )

    return result


def get_user_professions(
    user_id: int | None,
    db: Session,
) -> List[ProfessionListWithDetailRes]:
    professions = profession_queries.get_user_professions(user_id, db)
    results = []
    for prof in professions:

        (
            profession,
            mission,
            mission_completed,
            parent1_prof,
            parent1_unlocked,
            parent2_prof,
            parent2_unlocked,
        ) = prof

        mission_obj = None
        if mission:
            mission_obj = SavedProfessionMissionRes(
                name=mission.name,
                is_complete=mission_completed,
            )

        formula = []
        if parent1_prof:
            formula.append(
                SavedProfessionFormulaRes(
                    id=parent1_prof.id,
                    name=parent1_prof.name,
                    category=parent1_prof.category,
                    is_unlocked=parent1_unlocked,
                )
            )
        if parent2_prof:
            formula.append(
                SavedProfessionFormulaRes(
                    id=parent2_prof.id,
                    name=parent2_prof.name,
                    category=parent2_prof.category,
                    is_unlocked=parent2_unlocked,
                )
            )

        results.append(
            ProfessionListWithDetailRes(
                id=profession.id,
                name=profession.name,
                category=profession.category,
                mission=mission_obj,
                formula=formula,
            )
        )
    return results
