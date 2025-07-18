"""Recommend the next profession(s) to splice.

Usage: python -m pixel_people_optimizer.recommend <remaining_land_tiles>
"""

from __future__ import annotations

import argparse
import sys
from typing import NamedTuple, Optional

from rich import box
from rich.console import Console
from rich.table import Table
from sqlalchemy.orm import Session

from .db import SessionLocal, init_db
from .models import Building, MyBuilding, MyProfession, Profession, SpliceFormula

console = Console()


class Candidate(NamedTuple):
    profession: Profession
    parent1: Profession | None
    parent2: Profession | None
    unlock_bldg: Building | None
    extra_land_needed: int
    score: float  # higher → better (coin_output × multiplier)


# ------------------------------------------------------------


def build_lookup(session: Session) -> tuple[set[int], dict[int, Building]]:
    my_bldg_ids = {mb.building_id for mb in session.query(MyBuilding)}
    bldg_map = {b.id: b for b in session.query(Building)}
    return my_bldg_ids, bldg_map


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
            # Require both parents to be discovered and the profession not yet discovered
            if (
                not formula
                or not parent1
                or not parent2
                or parent1.id not in discovered_prof_ids
                or parent2.id not in discovered_prof_ids
                or prof.id in discovered_prof_ids
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

        score = unlock_b.coin_output * unlock_b.multiplier
        candidates.append(
            Candidate(prof, parent1, parent2, unlock_b, extra_land, score)
        )

    # Sort and return top N
    candidates.sort(key=lambda c: (c.extra_land_needed, -c.score))
    return candidates[:limit] if limit else candidates


# ------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Recommend new professions to splice")
    parser.add_argument("remaining_land", type=int, help="Tiles of land still free")
    parser.add_argument(
        "--limit", type=int, default=10, help="How many suggestions to show"
    )
    args = parser.parse_args(argv)

    init_db()
    with SessionLocal() as s:
        cands = recommend_professions(s, None, args.remaining_land, args.limit)

    if not cands:
        console.print("[bold red]No profession fits your land constraint![/]")
        return 1

    table = Table(box=box.SIMPLE_HEAVY)
    table.add_column("ID", justify="right")
    table.add_column("Profession")
    table.add_column("Parents")
    table.add_column("Unlocks Building → Land")
    table.add_column("ΔLand", justify="right")
    table.add_column("Score", justify="right")

    for c in cands:
        p, p1, p2, b, extra_land, score = c
        parents = " + ".join(f"{x.name} ({x.category})" for x in (p1, p2) if x) or "—"
        b_info = f"{b.name} → {b.land_size}" if b else "—"

        table.add_row(
            str(p.id),
            p.name,
            parents,
            b_info,
            str(extra_land),
            f"{score:,.0f}",
        )

    console.print(table)
    return 0


if __name__ == "__main__":
    sys.exit(main())
