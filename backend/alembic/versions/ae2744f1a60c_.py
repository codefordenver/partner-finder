"""empty message

Revision ID: ae2744f1a60c
Revises: 063a9e5bc287
Create Date: 2021-06-08 18:12:40.219279

"""
from sqlalchemy import text

from api.db import db, test_db


# revision identifiers, used by Alembic.
revision = 'ae2744f1a60c'
down_revision = '063a9e5bc287'
branch_labels = None
depends_on = None


def _create_leads_text_search_index(db):
    with db.get_connection() as conn:
        conn.execute(text("""
            CREATE INDEX leads_company_name_text_search_idx
            ON leads
            USING gin(to_tsvector('simple', company_name))
        """))


def _drop_leads_text_search_index(db):
    with db.get_connection() as conn:
        conn.execute(text("""
            DROP INDEX leads_company_name_text_search_idx;
        """))


def upgrade():
    _create_leads_text_search_index(db)
    _create_leads_text_search_index(test_db)


def downgrade():
    _drop_leads_text_search_index(db)
    _drop_leads_text_search_index(test_db)
