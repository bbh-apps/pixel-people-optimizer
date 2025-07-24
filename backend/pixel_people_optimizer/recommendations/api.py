from typing import List

from fastapi import APIRouter, Depends
from gotrue import Session
from pixel_people_optimizer.auth.service import get_current_user_id
from pixel_people_optimizer.db import get_db
from pixel_people_optimizer.professions.schema import ProfessionListRes
from pixel_people_optimizer.recommendations.schema import (
    RecommendationRes,
    UnlockBuildingRes,
)
from pixel_people_optimizer.recommendations.service import recommend_professions

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/", response_model=List[RecommendationRes])
def get_recommendations(
    remaining_land: int,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
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
                else UnlockBuildingRes(
                    id=rec.unlock_bldg.id,
                    name=rec.unlock_bldg.name,
                    professions=list(
                        [
                            ProfessionListRes(id=p.id, name=p.name, category=p.category)
                            for p in rec.unlock_bldg.professions
                        ]
                    ),
                )
            ),
            unlock_professions=list(
                [
                    ProfessionListRes(id=p.id, name=p.name, category=p.category)
                    for p in rec.unlock_professions
                ]
            ),
            extra_land_needed=rec.extra_land_needed,
            max_cps=rec.max_cps,
        )
        for rec in recommendations
    ]
