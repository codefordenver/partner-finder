"""create tags table

Revision ID: 31510e77401b
Revises: 2021_06_14
Create Date: 2021-07-15 00:03:45.836493

"""
from sqlalchemy import text

from api.db import db, test_db


# revision identifiers, used by Alembic.
revision = "2021_07_15"
down_revision = "2021_06_14"
branch_labels = None
depends_on = None


def _create_tags_table(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS tags (
                    id SERIAL PRIMARY KEY NOT NULL,
                    tag TEXT UNIQUE
                );
                """
            )
        )


def _drop_tags_table(db):
    with db.get_connection() as conn:
        conn.execute(
            """
                DROP TABLE tags;
            """
        )


def upgrade():
    _create_tags_table(db)
    _create_tags_table(test_db)


def downgrade():
    _drop_tags_table(db)
    _drop_tags_table(test_db)
