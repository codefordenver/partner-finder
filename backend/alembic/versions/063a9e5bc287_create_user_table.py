"""create user table

Revision ID: 063a9e5bc287
Revises: 37ad66f1e7a5
Create Date: 2021-05-26 22:58:01.840387

"""
from alembic import op
import sqlalchemy as sa

from api.db import db, test_db


# revision identifiers, used by Alembic.
revision = "063a9e5bc287"
down_revision = "37ad66f1e7a5"
branch_labels = None
depends_on = None


def upgrade():
    _create_users_table(db)
    _create_users_table(test_db)


def _create_users_table(db):
    with db.get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE users (
                username VARCHAR(100) PRIMARY KEY,
                password_hash VARCHAR(100),
                admin BOOLEAN DEFAULT false
            );
        """
        )


def downgrade():
    _drop_users_table(db)
    _drop_users_table(test_db)


def _drop_users_table(db):
    with db.get_connection() as conn:
        conn.execute(
            """
            DROP TABLE users;
        """
        )
