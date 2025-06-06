"""Add events and matches tables

Revision ID: 88f37ed20c72
Revises: 9672d7bf6fa1
Create Date: 2025-05-29 22:35:40.546796

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '88f37ed20c72'
down_revision: Union[str, None] = '9672d7bf6fa1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('location', sa.String(), nullable=True))
    op.add_column('matches', sa.Column('weightclass', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('matches', 'weightclass')
    op.drop_column('events', 'location')
    # ### end Alembic commands ###
