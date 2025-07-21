"""backfill user data

Revision ID: 8bbc48ab5173
Revises: 90599b057497
Create Date: 2025-07-21 00:28:08.077875

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.sql import text

# revision identifiers, used by Alembic.
revision: str = "8bbc48ab5173"
down_revision: Union[str, Sequence[str], None] = "90599b057497"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


BASE_PROFESSION_IDS = (1, 2)


def upgrade() -> None:
    conn = op.get_bind()

    # Disable RLS
    conn.execute(text("ALTER TABLE my_professions DISABLE ROW LEVEL SECURITY;"))
    conn.execute(text("ALTER TABLE my_buildings DISABLE ROW LEVEL SECURITY;"))

    # Get all user IDs
    user_ids = [row[0] for row in conn.execute(text("SELECT id FROM users")).fetchall()]

    # Get building IDs linked to base professions
    building_rows = conn.execute(
        text(
            """
        SELECT DISTINCT building_id
        FROM profession_building
        WHERE profession_id = ANY(:base_ids)
    """
        ),
        {"base_ids": list(BASE_PROFESSION_IDS)},
    ).fetchall()
    base_building_ids = [row[0] for row in building_rows]

    for user_id in user_ids:
        for pid in BASE_PROFESSION_IDS:
            # Check if user already has this profession
            exists = conn.execute(
                text(
                    """
                SELECT 1 FROM my_professions WHERE user_id = :user_id AND profession_id = :pid
            """
                ),
                {"user_id": user_id, "pid": pid},
            ).fetchone()

            if not exists:
                conn.execute(
                    text(
                        """
                    INSERT INTO my_professions (user_id, profession_id)
                    VALUES (:user_id, :pid)
                """
                    ),
                    {"user_id": user_id, "pid": pid},
                )

        for bid in base_building_ids:
            # Check if user already has this building
            exists = conn.execute(
                text(
                    """
                SELECT 1 FROM my_buildings WHERE user_id = :user_id AND building_id = :bid
            """
                ),
                {"user_id": user_id, "bid": bid},
            ).fetchone()

            if not exists:
                conn.execute(
                    text(
                        """
                    INSERT INTO my_buildings (user_id, building_id)
                    VALUES (:user_id, :bid)
                """
                    ),
                    {"user_id": user_id, "bid": bid},
                )

    # Re-enable RLS
    conn.execute(text("ALTER TABLE my_professions ENABLE ROW LEVEL SECURITY;"))
    conn.execute(text("ALTER TABLE my_buildings ENABLE ROW LEVEL SECURITY;"))


def downgrade() -> None:
    pass
