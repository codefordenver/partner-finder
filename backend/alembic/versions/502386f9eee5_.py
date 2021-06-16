"""empty message

Revision ID: 502386f9eee5
Revises: ae2744f1a60c
Create Date: 2021-06-14 20:40:54.267528

"""

from api.db import db as dev_db, test_db


# revision identifiers, used by Alembic.
revision = '502386f9eee5'
down_revision = 'ae2744f1a60c'
branch_labels = None
depends_on = None


def _add_colorado_nonprofits_fields(connection):
    connection.execute("""
        ALTER TABLE leads
        ADD COLUMN instagram VARCHAR(100),
        ADD COLUMN mission_statement TEXT,
        ADD COLUMN programs TEXT,
        ADD COLUMN populations_served TEXT,
        ADD COLUMN county VARCHAR(50),
        ADD COLUMN colorado_region VARCHAR(50),
        ADD COLUMN data_source VARCHAR(50)
            CHECK (
                data_source IN (
                    'socrata',
                    'colorado_nonprofit_association',
                    'user_entry'
                )
            );
    """)


def _drop_colorado_nonprofits_fields(connection):
    connection.execute("""
        ALTER TABLE leads
        DROP COLUMN instagram,
        DROP COLUMN mission_statement,
        DROP COLUMN programs,
        DROP COLUMN populations_served,
        DROP COLUMN county,
        DROP COLUMN colorado_region,
        DROP COLUMN data_source;
    """)


def upgrade():
    for db in (dev_db, test_db):
        with db.transaction() as connection:
            _add_colorado_nonprofits_fields(connection)


def downgrade():
    for db in (dev_db, test_db):
        with db.transaction() as connection:
            _drop_colorado_nonprofits_fields(connection)
