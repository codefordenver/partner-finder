"""create leads table

Revision ID: 37ad66f1e7a5
Revises:
Create Date: 2021-05-04 15:32:34.423571

"""
from sqlalchemy import text

from api.db import db


# revision identifiers, used by Alembic.
revision = '37ad66f1e7a5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    with db.get_connection() as conn:
        # conn.execute(text(
        #     """
        #     CREATE SCHEMA IF NOT EXISTS api;
        #     """
        # ))
        conn.execute(text(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id SERIAL PRIMARY KEY NOT NULL,
                company_name VARCHAR(500) NOT NULL,
                company_address VARCHAR(500),
                contact_name VARCHAR(100),
                formation_date DATE,
                website VARCHAR(100),
                phone VARCHAR(100),
                email VARCHAR(100),
                twitter VARCHAR(100),
                facebook VARCHAR(100),
                linkedin VARCHAR(100),
                last_email TIMESTAMP,
                last_call TIMESTAMP,
                last_google_search TIMESTAMP,
                last_twitter_search TIMESTAMP,
                last_facebook_search TIMESTAMP,
                last_linkedin_search TIMESTAMP
            );
            """
        ))


def downgrade():
    with db.get_connection() as conn:
        conn.execute(
            """
                DROP TABLE leads;
            """
        )
