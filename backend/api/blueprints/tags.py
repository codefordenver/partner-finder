from flask import Blueprint, request, current_app

from sqlalchemy import text
from sqlalchemy.exc import IntegrityError

from ..auth import auth
from ..db import db


tags_bp = Blueprint("tags", __name__)


@tags_bp.route("/tags", methods=["GET", "POST"])
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
        return {"tags": response_body}, 200


def _create_tag(request):

    tag = request.get_json().get("tag")

    # TODO: handle missing tag field in request

    query = text(
        """
        INSERT INTO tags (tag)
        VALUES (:tag)
        RETURNING *;
    """
    )

    try:
        with db.get_engine().begin() as connection:
            row = connection.execute(query, tag=tag).first()
    except IntegrityError as e:
        current_app.logger.error(e)
        return {"message": f"Could not create a new tag: {tag}"}, 422

    return dict(row), 200


@tags_bp.route("/tags/<int:id>", methods=["GET", "PUT", "DELETE"])
@auth("user")
def tag_view(id):
    if request.method == "GET":
        return _get_tag_by_id(id)
    elif request.method == "PUT":
        return _modify_tag_with_id(id, request)
    elif request.method == "DELETE":
        return _delete_tag_with_id(id)
    return {"message": "Unknown http method"}, 404


def _get_tag_by_id(id):
    query = text(
        """
        SELECT * FROM tags
        where id = :id
        """
    )

    with db.get_connection() as conn:
        row = conn.execute(query, id=id).first()

    if row is None:
        return {
            "params": {
                "id": id,
            },
            "message": "Could not find a tag with the given id.",
        }, 404

    return dict(row), 200


def _modify_tag_with_id(id, request):
    tag = request.get_json().get("tag")

    if tag is None:
        return {"message": "Missing required field 'tag' in request body."}, 422

    query = text(
        """
        UPDATE tags
        SET tag = :tag
        WHERE id = :id
        RETURNING *;
    """
    )

    with db.get_engine().begin() as conn:
        row = conn.execute(
            query,
            id=id,
            tag=tag,
        ).first()

        if row is None:
            return {
                "params": {
                    "id": id,
                },
                "body": request.get_json(),
                "message": "Could not find tag with the given id",
            }, 404

        return dict(row), 200


def _delete_tag_with_id(id):

    query = text(
        """
        DELETE FROM tags
        WHERE id = :id
        RETURNING *;
        """
    )

    with db.get_engine().begin() as conn:
        row = conn.execute(query, id=id).first()

    if row is None:
        return {
            "params": {
                "id": id,
            },
            "message": "Could not find tag with the given id.",
        }, 404

    return dict(row)
