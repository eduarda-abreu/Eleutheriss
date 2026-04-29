"""SM-6 create transactions table (receipt/comprovante)

Revision ID: a1b2c3d4e5f6
Revises: 1e82dd7afa29
Create Date: 2026-04-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '1e82dd7afa29'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'transactions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('file_url', sa.String(), nullable=False),
        sa.Column(
            'file_type',
            sa.Enum('JPG', 'PNG', 'PDF', name='filetype'),
            nullable=False,
        ),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.Column(
            'processing_status',
            sa.Enum('pending', 'processing', 'completed', 'error', name='processingstatus'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('transactions')
    op.execute('DROP TYPE IF EXISTS filetype')
    op.execute('DROP TYPE IF EXISTS processingstatus')
