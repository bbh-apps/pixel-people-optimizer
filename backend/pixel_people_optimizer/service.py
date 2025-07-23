from typing import Type

from fastapi import HTTPException
from sqlalchemy.orm import Session

from .models import Profession, SpliceFormula
from .schema import (
    IDList,
    MissionListRes,
    ProfessionListRes,
    ProfessionListWithMissionRes,
)


def sync_user_items(
    *,
    user_id: str,
    db: Session,
    payload: IDList,
    item_model: Type,
    link_model: Type,
    link_field: str,
):
    # Validate incoming IDs exist in item table
    existing_ids = {
        row.id
        for row in db.query(item_model).filter(item_model.id.in_(payload.ids)).all()
    }
    incoming_ids = set(payload.ids)

    if existing_ids != incoming_ids:
        invalid_ids = incoming_ids - existing_ids
        raise HTTPException(status_code=404, detail=f"Invalid IDs: {list(invalid_ids)}")

    # Get current saved item IDs for the user
    current_ids = {
        getattr(row, link_field)
        for row in db.query(link_model).filter_by(user_id=user_id).all()
    }

    # Determine diffs
    to_add = incoming_ids - current_ids
    to_delete = current_ids - incoming_ids

    # Delete removed items
    if to_delete:
        db.query(link_model).filter_by(user_id=user_id).filter(
            getattr(link_model, link_field).in_(to_delete)
        ).delete(synchronize_session=False)

    # Add new items
    for item_id in to_add:
        db.add(link_model(user_id=user_id, **{link_field: item_id}))

    db.commit()


def get_profession_list_with_mission_response(
    profession: Profession,
) -> ProfessionListWithMissionRes:
    mission = (
        MissionListRes(
            id=profession.unlock_mission.id,
            name=profession.unlock_mission.name,
        )
        if profession.unlock_mission
        else None
    )

    formula = profession.formula
    parents = [formula.parent1, formula.parent2] if formula else []

    return ProfessionListWithMissionRes(
        id=profession.id,
        name=profession.name,
        category=profession.category,
        mission=mission,
        formula=(
            [
                ProfessionListRes(id=p.id, name=p.name, category=p.category)
                for p in parents
                if p
            ]
            if parents
            else None
        ),
    )
