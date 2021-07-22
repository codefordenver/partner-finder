"""add assigned column

Revision ID: 9d857b23b162
Revises: 3d9074e4b65e
Create Date: 2021-07-21 22:07:54.147288

"""
from api.db import db, test_db
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "9d857b23b162"
down_revision = "3d9074e4b65e"
branch_labels = None
depends_on = None


def _add_assigned_column(db):
    query = text(
        """
        ALTER TABLE leads
        ADD COLUMN assigned TEXT;
        """
    )
    with db.get_connection() as conn:
        conn.execute(query)


def _drop_assigned_column(db):
    query = text(
        """
        ALTER TABLE leads
        DROP COLUMN assigned;
        """
    )
    with db.get_connection() as conn:
        conn.execute(query)


def upgrade():
    _add_assigned_column(db)
    _add_assigned_column(test_db)


def downgrade():
    _drop_assigned_column(db)
    _drop_assigned_column(test_db)
