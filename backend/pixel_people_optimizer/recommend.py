"""Recommend the next profession(s) to splice.

Usage: python -m pixel_people_optimizer.recommend <remaining_land_tiles>
"""

from __future__ import annotations

from typing import List, NamedTuple, Optional

from sqlalchemy.orm import Session

from .models import Building, MyBuilding, MyProfession, Profession, SpliceFormula


class Candidate(NamedTuple):
    profession: Profession
    parent1: Profession | None
    parent2: Profession | None
    unlock_bldg: Building | None
    unlock_professions: List[Profession]
    extra_land_needed: int
    max_cps: int


def build_lookup(session: Session) -> tuple[set[int], dict[int, Building]]:
    my_bldg_ids = {mb.building_id for mb in session.query(MyBuilding)}
    bldg_map = {b.id: b for b in session.query(Building)}
    return my_bldg_ids, bldg_map


def get_unlocked_professions(db: Session, parent_id: int) -> list[Profession]:
    return (
        db.query(Profession)
        .join(SpliceFormula, SpliceFormula.id == Profession.id)
        .filter(
            (SpliceFormula.parent1_id == parent_id)
            | (SpliceFormula.parent2_id == parent_id)
        )
        .all()
    )


def recommend_professions(
    session: Session,
    user_id: Optional[str],
    remaining_land: int,
    limit: Optional[int] = None,
) -> list[Candidate]:
    # Load all professions, buildings, and formulas
    professions = {p.id: p for p in session.query(Profession)}
    formulas = {f.id: f for f in session.query(SpliceFormula)}
    buildings = {b.id: b for b in session.query(Building)}

    if user_id:
        # Authenticated user
        discovered_prof_ids = {
            mp.profession_id
            for mp in session.query(MyProfession).filter(
                MyProfession.user_id == user_id
            )
        }
        built_bldg_ids = {
            mb.building_id
            for mb in session.query(MyBuilding).filter(MyBuilding.user_id == user_id)
        }
    else:
        # Anonymous user
        discovered_prof_ids = set()
        built_bldg_ids = set()

    candidates: list[Candidate] = []
    base_professions: set[Profession] = set()

    for [_, prof] in list(professions.items()):
        formula = formulas.get(prof.id)
        parent1 = (
            professions.get(formula.parent1_id)
            if formula and formula.parent1_id
            else None
        )
        parent2 = (
            professions.get(formula.parent2_id)
            if formula and formula.parent2_id
            else None
        )

        # Add base professions for initial combinations
        if parent1 is None and parent2 is None and prof.category != "Special":
            base_professions.add(prof)

        if user_id:
            # Require both parents unless it's a base profession
            if prof.id in discovered_prof_ids:
                continue
            if formula and (not parent1 or not parent2):
                continue
            if formula and (
                (parent1 and parent1.id not in discovered_prof_ids)
                or (parent2 and parent2.id not in discovered_prof_ids)
            ):
                continue
        else:
            # Anonymous: recommend professions derived from base only and skip special categories
            is_parent1_in_formula = parent1 in base_professions
            is_parent2_in_formula = parent2 in base_professions
            if not (is_parent1_in_formula and is_parent2_in_formula):
                continue
            if prof.category == "Special":
                continue

        # Check if unlocked building
        unlock_b = buildings.get(prof.unlock_bldg_id) if prof.unlock_bldg_id else None
        if not unlock_b:
            continue

        # Calculate land cost
        extra_land = 0 if unlock_b.id in built_bldg_ids else unlock_b.land_size
        if extra_land > remaining_land:
            continue

        unlock_prof = get_unlocked_professions(session, prof.id)
        score = unlock_b.coin_output * unlock_b.multiplier
        candidates.append(
            Candidate(
                profession=prof,
                parent1=parent1,
                parent2=parent2,
                unlock_bldg=unlock_b,
                unlock_professions=unlock_prof,
                extra_land_needed=extra_land,
                max_cps=unlock_b.coin_output,
            )
        )

    # Sort and return top N
    candidates.sort(key=lambda c: (c.extra_land_needed, -c.max_cps))
    return candidates[:limit] if limit else candidates
