from flask import Blueprint, request

from sqlalchemy import text

from ..auth import auth
from ..db import db


tags_bp = Blueprint("tags", __name__)


@tags_bp.route('/tags', methods=["GET", "POST"])
@auth("user")
def tags_collection_view():
    if request.method == "GET":
        return _get_all_tags(request)
    elif request.method == "POST":
        return _create_tag(request)
    return {
        "message": "Unknown http method",
    }, 404


def _get_all_tags(request):

    query = text(
        """
        SELECT id, tag
        FROM tags
        """
    )

    with db.get_connection() as connection:
        res = connection.execute(query)
        response_body = []
        for row in res:
            response_body.append(dict(row))
        return {
            "tags": response_body
        }, 200


def _create_tag(request):

    tag = request.get_json().get('tag')

    # TODO: handle missing tag field in request

    query = text("""
        INSERT INTO tags (tag)
        VALUES (:tag)
        RETURNING *;
    """)

    with db.get_engine().begin() as connection:
        row = connection.execute(
            query,
            tag=tag
        ).first()

    return dict(row)
