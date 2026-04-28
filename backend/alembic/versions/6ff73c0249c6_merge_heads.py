"""merge_heads

Revision ID: 6ff73c0249c6
Revises: a1b2c3d4e5f6, d0f7ba50f7ee
Create Date: 2026-04-28 16:59:10.941401

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6ff73c0249c6'
down_revision: Union[str, None] = ('a1b2c3d4e5f6', 'd0f7ba50f7ee')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass