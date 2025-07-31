from collections import defaultdict
from typing import Any, List, Optional

from pixel_people_optimizer.formulas.models import SpliceFormula
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


def build_reverse_graph(
    splice_formulas: List[SpliceFormula],
) -> defaultdict[int, list[tuple[Optional[int], Optional[int]]]]:
    graph = defaultdict(list)
    for sf in splice_formulas:
        graph[sf.id].append((sf.parent1_id, sf.parent2_id))
    return graph


def deduplicate_path_list(paths: list[list[int]]) -> list[list[int]]:
    seen = set()
    deduped = []
    for path in paths:
        t = tuple(path)
        if t not in seen:
            seen.add(t)
            deduped.append(path)
    return deduped


def compute_shortest_paths_to_target(
    target_profession_id: int,
    reverse_graph: dict[int, list[tuple[Optional[int], Optional[int]]]],
) -> list[list[int]]:
    """
    Returns all paths from roots (professions with no parents) to the given target profession.
    Each path is a list of profession IDs from root to target.
    """
    memo: dict[int, list[list[int]]] = {}

    def dfs(current: int, stack: set[int]) -> list[list[int]]:
        if current in stack:
            return []  # cycle

        if current in memo:
            return memo[current]

        parents = reverse_graph.get(current, [])
        if not parents or all(p == (None, None) for p in parents):
            memo[current] = [[current]]
            return memo[current]

        stack.add(current)
        paths = []
        for p1, p2 in parents:
            for parent in (p1, p2):
                if parent is not None:
                    for path in dfs(parent, stack):
                        paths.append(path + [current])
        stack.remove(current)

        memo[current] = paths
        return paths

    all_paths = dfs(target_profession_id, set())
    return deduplicate_path_list(all_paths)
