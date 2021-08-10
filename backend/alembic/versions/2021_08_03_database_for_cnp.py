"""Database for CNP

Revision ID: dc0ca6997b4d
Revises: 9d857b23b162
Create Date: 2021-08-03 03:14:54.615442

"""
from sqlalchemy import text

from api.db import db, test_db


# revision identifiers, used by Alembic.
revision = "dc0ca6997b4d"
down_revision = "9d857b23b162"
branch_labels = None
depends_on = None


def _colorado_nonprofits_fields_to_text(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                ALTER TABLE leads
                    ALTER COLUMN facebook TYPE TEXT,
                    ALTER COLUMN linkedin TYPE TEXT,
                    ALTER COLUMN website TYPE TEXT,
                    ALTER COLUMN twitter TYPE TEXT;
                """
            )
        )


def _colorado_nonprofits_fields_to_varchar(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                ALTER TABLE leads
                    ALTER COLUMN facebook TYPE VARCHAR,
                    ALTER COLUMN linkedin TYPE VARCHAR,
                    ALTER COLUMN website TYPE VARCHAR,
                    ALTER COLUMN twitter TYPE VARCHAR;
                """
            )
        )


def upgrade():
    _colorado_nonprofits_fields_to_text(test_db)
    _colorado_nonprofits_fields_to_text(db)


def downgrade():
    _colorado_nonprofits_fields_to_varchar(test_db)
    _colorado_nonprofits_fields_to_varchar(db)
