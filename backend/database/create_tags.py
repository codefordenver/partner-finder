"""
Populates the tags and leads_tags tables
"""
from sqlalchemy import text

from api.app import app
from api.db import db


# values taken from the populations_served column of the leads table
POPULATIONS_SERVED_TAGS = frozenset(
    [
        "African-American",
        # 'All Populations',
        "American Indian/Native American",
        "Animals",
        "Asian-American",
        "At-Risk Youth",
        "Bisexual",
        "Children and Youth",
        "Elderly",
        "Families",
        "Gay",
        "Immigrants",
        "Latino/Hispanic",
        "Lesbian",
        "Low Income",
        "Men and Boys",
        # 'Other',
        "People Experiencing Homelessness",
        "People Living With Disabilities",
        "Rural",
        "Transgender",
        "Urban",
        "Veterans",
        "Women and Girls",
    ]
)


def delete_all_tags():
    delete_tags = text(
        """
        DELETE FROM tags;
    """
    )
    with db.get_connection() as conn:
        conn.execute(delete_tags)


def create_tags(tags):
    # write sql query
    insert_tag = text(
        """
        INSERT INTO tags
        (tag)
        VALUES
        (:tag)
    """
    )
    # execute sql query
    tags = list(tags)
    with db.get_connection() as conn:
        with conn.begin():
            for tag in tags:
                conn.execute(insert_tag, tag=tag)


def assign_tags_to_leads():
    get_tag_ids = text(
        """
        SELECT id, tag FROM tags;
    """
    )

    with db.get_connection() as conn:
        res = conn.execute(get_tag_ids)
        tag_id = {row["tag"]: row["id"] for row in res}

    insert_tags_for_leads = text(
        """
        INSERT INTO lead_tag
        (lead_id, tag_id)
        VALUES
        (:lead_id, :tag_id)
        """
    )

    with db.get_connection() as conn:
        with conn.begin():
            leads = conn.execute(
                text(
                    """
                SELECT id, populations_served FROM leads;
            """
                )
            )
            for lead in leads:
                if populations_served := lead["populations_served"]:
                    for tag in populations_served.split(", "):
                        if tid := tag_id.get(tag):
                            conn.execute(insert_tags_for_leads, lead_id=lead["id"], tag_id=tid)


if __name__ == "__main__":
    with app.app_context():
        print("Deleting all records from tags table")
        delete_all_tags()
        print("Creating tags for development...")
        create_tags(POPULATIONS_SERVED_TAGS)
        print("Assigning tags to leads for development...")
        assign_tags_to_leads()
