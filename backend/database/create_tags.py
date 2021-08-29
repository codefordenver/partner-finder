"""
Populates the tags and leads_tags tables
"""
from sqlalchemy import text

from api.app import app
from api.db import db


def delete_all_tags():
    delete_tags = text(
        """
        DELETE FROM tags;
    """
    )
    with db.get_connection() as conn:
        conn.execute(delete_tags)


def create_tags():
    # write sql query
    insert_tags = text(
        """
        INSERT INTO tags
        (tag)
        VALUES
        ('environmental'),
        ('legal'),
        ('educational')
    """
    )
    # execute sql query
    with db.get_connection() as conn:
        conn.execute(insert_tags)


def assign_tags_to_leads():
    get_tag_ids = text(
        """
        SELECT id, tag FROM tags;
    """
    )

    insert_tags_for_leads = text(
        """
        INSERT INTO lead_tag
        (lead_id, tag_id)
        VALUES
        (42, :environmental_id),
        (42, :educational_id),
        (420, :legal_id),
        (420, :educational_id)
    """
    )

    with db.get_connection() as conn:
        res = conn.execute(get_tag_ids)
        dict_records = map(dict, res)
        map_tag_name_to_id = {d["tag"]: d["id"] for d in dict_records}
        environmental_id = map_tag_name_to_id["environmental"]
        legal_id = map_tag_name_to_id["legal"]
        educational_id = map_tag_name_to_id["educational"]

        conn.execute(
            insert_tags_for_leads,
            environmental_id=environmental_id,
            legal_id=legal_id,
            educational_id=educational_id,
        )


if __name__ == "__main__":
    with app.app_context():
        print("Deleting all records from tags table")
        delete_all_tags()
        print("Creating tags for development...")
        create_tags()
        print("Assigning tags to leads for development...")
        assign_tags_to_leads()
