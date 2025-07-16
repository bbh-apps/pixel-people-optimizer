"""Recommend the next profession(s) to splice.

Usage: python -m pixel_people_optimizer.recommend <remaining_land_tiles>
"""

from __future__ import annotations

import argparse
import sys
from typing import NamedTuple

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


def choose_candidates(remaining_land: int, session: Session) -> list[Candidate]:
    my_prof_ids = {mp.profession_id for mp in session.query(MyProfession)}
    my_bldg_ids, bldg_map = build_lookup(session)

    formulas = {f.id: f for f in session.query(SpliceFormula)}
    professions_by_id = {p.id: p for p in session.query(Profession)}

    candidates: list[Candidate] = []
    for p in professions_by_id.values():
        if p.id in my_prof_ids:
            continue  # already discovered

        f = formulas.get(p.id)
        parent1 = (
            professions_by_id.get(f.parent1_id)
            if f and f.parent1_id is not None
            else None
        )
        parent2 = (
            professions_by_id.get(f.parent2_id)
            if f and f.parent2_id is not None
            else None
        )

        # Only recommend if both parents are discovered (or it's a base profession)
        if f and (
            not parent1
            or not parent2
            or parent1.id not in my_prof_ids
            or parent2.id not in my_prof_ids
        ):
            continue

        unlock_b = bldg_map.get(p.unlock_bldg)
        if not unlock_b:
            continue  # no unlock building defined

        extra_land = 0 if unlock_b.id in my_bldg_ids else unlock_b.land_size
        if extra_land > remaining_land:
            continue  # can’t afford

        score = unlock_b.coin_output * unlock_b.multiplier
        candidates.append(Candidate(p, parent1, parent2, unlock_b, extra_land, score))

    candidates.sort(key=lambda c: (c.extra_land_needed, -c.score))
    return candidates


def recommend_professions(db: Session, user_id: str, remaining_land: int, limit: int):
    return choose_candidates(remaining_land, db)[:limit]


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
        cands = choose_candidates(args.remaining_land, s)[: args.limit]

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
