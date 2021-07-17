"""tag_lead_mm_relationship

Revision ID: a6d98771c267
Revises: 2021_07_15
Create Date: 2021-07-17 11:16:04.095571

"""
from sqlalchemy import text

from api.db import db, test_db


# revision identifiers, used by Alembic.
revision = "a6d98771c267"
down_revision = "2021_07_15"
branch_labels = None
depends_on = None


def _create_tag_lead_association_table(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS lead_tag (
                    id SERIAL PRIMARY KEY NOT NULL,
                    lead_id SERIAL NOT NULL,
                    tag_id SERIAL NOT NULL,
                    CONSTRAINT fk_lead
                        FOREIGN KEY(lead_id)
                        REFERENCES leads(id)
                        ON DELETE CASCADE,
                    CONSTRAINT fk_tag
                        FOREIGN KEY (tag_id)
                        REFERENCES tags(id)
                        ON DELETE CASCADE
                );
                """
            )
        )


def _drop_tag_lead_association_table(db):
    with db.get_connection() as conn:
        conn.execute(
            text(
                """
                DROP TABLE lead_tag;
                """
            )
        )


def upgrade():
    _create_tag_lead_association_table(db)
    _create_tag_lead_association_table(test_db)


def downgrade():
    _drop_tag_lead_association_table(db)
    _drop_tag_lead_association_table(test_db)
