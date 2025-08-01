from collections import defaultdict, deque
from typing import List, Optional

from pixel_people_optimizer.formulas.models import SpliceFormula
from pixel_people_optimizer.formulas.schema import (
    ProfessionGraph,
    ProfessionGraphEdge,
    ProfessionGraphNode,
)
from pixel_people_optimizer.missions.schema import MissionListRes
from pixel_people_optimizer.professions.models import Profession
from sqlalchemy.orm import Session, selectinload


def build_graph_data(db: Session) -> ProfessionGraph:
    splice_formulas = db.query(SpliceFormula).all()
    edges = []

    for i, sf in enumerate(splice_formulas):
        parent1 = sf.parent1_id
        parent2 = sf.parent2_id
        result = sf.id

        edges.append(
            ProfessionGraphEdge(id=f"e{i}_1", source_id=parent1, target_id=result)
        )
        edges.append(
            ProfessionGraphEdge(id=f"e{i}_2", source_id=parent2, target_id=result)
        )

    return ProfessionGraph(edges=edges)


def build_reverse_graph(
    splice_formulas: List[SpliceFormula],
) -> defaultdict[int, list[tuple[Optional[int], Optional[int]]]]:
    graph = defaultdict(list)
    for sf in splice_formulas:
        graph[sf.id].append((sf.parent1_id, sf.parent2_id))
    return graph


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

    return dfs(target_profession_id, set())
