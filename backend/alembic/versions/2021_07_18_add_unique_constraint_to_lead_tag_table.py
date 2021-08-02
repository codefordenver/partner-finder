"""add unique constraint to lead tag table

Revision ID: 3d9074e4b65e
Revises: a6d98771c267
Create Date: 2021-07-18 11:43:03.562940

"""
from sqlalchemy import text

from api.db import db, test_db


# revision identifiers, used by Alembic.
revision = "3d9074e4b65e"
down_revision = "a6d98771c267"
branch_labels = None
depends_on = None


def _create_unique_index(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                CREATE UNIQUE INDEX idx_unique_lead_id_tag_id
                ON lead_tag (lead_id, tag_id);
            """
            )
        )


def _create_unique_constraint(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                ALTER TABLE lead_tag
                ADD CONSTRAINT unique_lead_id_tag_id
                UNIQUE USING INDEX idx_unique_lead_id_tag_id;
            """
            )
        )


def _drop_unique_index(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                DROP INDEX idx_unique_lead_id_tag_id;
            """
            )
        )


def _drop_unique_constraint(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                ALTER TABLE lead_tag
                DROP CONSTRAINT unique_lead_id_tag_id;
            """
            )
        )


def upgrade():
    _create_unique_index(db)
    _create_unique_constraint(db)
    _create_unique_index(test_db)
    _create_unique_constraint(test_db)


def downgrade():
    _drop_unique_constraint(db)
    _drop_unique_index(db)
    _drop_unique_constraint(test_db)
    _drop_unique_index(test_db)
