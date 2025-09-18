"""backfill special mission profession table

Revision ID: f1bab7574487
Revises: 4f8c17eecf9d
Create Date: 2025-09-17 20:35:44.116383

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pixel_people_optimizer.models import SpecialMissionProfession
from pixel_people_optimizer.professions import queries as profession_queries
from pixel_people_optimizer.professions.models import Profession
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision: str = "f1bab7574487"
down_revision: Union[str, Sequence[str], None] = "4f8c17eecf9d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def find_unlocking_missions(prof: Profession) -> list[tuple[Profession, bool]]:
    """
    Recursively find all ancestors (including self) that are directly unlocked by a mission.
    Returns a list of tuples: (ancestor_profession_with_mission, is_direct)
    """
    results: list[tuple[Profession, bool]] = []

    # If the current profession has a direct unlock mission
    if prof.unlock_mission is not None:
        results.append((prof, True))

    if prof.formula is None:
        return results

    # Check both parents recursively
    for parent in (prof.formula.parent1, prof.formula.parent2):
        if parent:
            parent_results = find_unlocking_missions(parent)
            # Any ancestor beyond the current prof is indirect
            results.extend((ancestor, False) for ancestor, _ in parent_results)

    return results


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    session = Session(bind=bind)

    professions = profession_queries.get_all_professions(db=session)
    for prof in professions:
        unlocks = find_unlocking_missions(prof)
        for mission_prof, is_direct in unlocks:
            session.merge(
                SpecialMissionProfession(
                    special_mission_id=mission_prof.unlock_mission.id,
                    profession_id=prof.id,
                    is_direct=is_direct,
                )
            )
            print(
                f"{'Direct' if is_direct else 'Indirect'} unlock: {prof.name} via {mission_prof.name}"
            )

    session.commit()


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    session = Session(bind=bind)

    session.query(SpecialMissionProfession).delete()
    session.commit()
