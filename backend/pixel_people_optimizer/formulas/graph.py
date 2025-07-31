from pixel_people_optimizer.formulas.models import SpliceFormula
from pixel_people_optimizer.formulas.schema import ProfessionGraph, ProfessionGraphEdge
from sqlalchemy.orm import Session


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
