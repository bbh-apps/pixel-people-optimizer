"""backfill special missions table

Revision ID: b31816bac136
Revises: 0c4444c27700
Create Date: 2025-07-22 16:15:31.101891

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pixel_people_optimizer.models import Profession
from pixel_people_optimizer.scripts.scrape import scrape_missions
from sqlalchemy.orm import Session

# revision identifiers, used by Alembic.
revision: str = "b31816bac136"
down_revision: Union[str, Sequence[str], None] = "0c4444c27700"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    session = Session(bind=bind)

    scrape_missions(session)
    session.commit()


def downgrade() -> None:
    """Downgrade schema."""
    bind = op.get_bind()
    session = Session(bind=bind)

    session.query(Profession).update({Profession.unlock_mission_id: None})
    session.commit()
