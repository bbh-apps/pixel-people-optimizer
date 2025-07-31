from typing import List

from pixel_people_optimizer.buildings import queries
from pixel_people_optimizer.buildings.schema import (
    BuildingListRes,
    BuildingListWithDetailRes,
    BuildingProfessionRes,
)
from pixel_people_optimizer.professions import queries as profession_queries
from pixel_people_optimizer.professions.schema import (
    ProfessionListRes,
    SavedProfessionFormulaRes,
)
from sqlalchemy import select
from sqlalchemy.orm import Session


def get_all_buildings_with_user_data(
    user_id: int | None, db: Session
) -> List[BuildingListWithDetailRes]:
    buildings = queries.get_all_buildings(db=db)
    unlocked_subq = (
        profession_queries.get_user_unlocked_professions(user_id, db)
        if user_id
        else None
    )

    unlocked_ids = set()

    if unlocked_subq is not None:
        unlocked_ids = {
            row[0] for row in db.execute(select(unlocked_subq.c.profession_id))
        }

    result = []
    for b in buildings:

        professions_res = []
        unlock_for_bldg_ids = {u.id for u in b.unlock_professions}

        for p in b.professions:
            is_unlocked = p.id in unlocked_ids
            is_unlock_bldg = p.id in unlock_for_bldg_ids
            professions_res.append(
                BuildingProfessionRes(
                    id=p.id,
                    name=p.name,
                    category=p.category,
                    is_unlocked=is_unlocked,
                    is_unlock_bldg=is_unlock_bldg,
                )
            )

        professions_res.sort(key=lambda x: (not x.is_unlock_bldg, not x.is_unlocked))

        result.append(
            BuildingListWithDetailRes(
                id=b.id,
                name=b.name,
                land_cost=b.land_size,
                max_cps=b.coin_output,
                professions=professions_res,
            )
        )

    return result
