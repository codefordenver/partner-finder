from flask import Blueprint, request
from sqlalchemy import text

from ..auth import hash_password, auth
from ..db import db
from ..pagination import parse_pagination_params
from ..util.dict import exclude_keys

users_bp = Blueprint("users", __name__)


@users_bp.route("/users", methods=["GET"])
@auth("user")
def get_all_users():
    return _get_all_users(request)


@users_bp.route("/users", methods=["POST"])
@auth("admin")
def create_user():
    return _create_user(request)


def _get_all_users(request):
    page, perpage = parse_pagination_params(request)
    query = text(
        """
        SELECT * FROM users
        LIMIT :limit
        OFFSET :offset
    """
    )
    query_params = {
        "limit": perpage,
        "offset": (page - 1) * perpage,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        users = (parse_user_row(r) for r in res)
        return {
            "pagination": {
                "page": page,
                "perpage": perpage,
            },
            "users": [user["username"] for user in users],
        }


@exclude_keys(("password_hash"))
def parse_user_row(row):
    return dict(row)


def _create_user(request):
    username, password = request.json.get("username"), request.json.get("password")
    admin = request.json.get("admin", False)
    for field, name in [(username, "username"), (password, "password")]:
        if field is None:
            return {"message": f"missing required field {name!r}"}, 400
    password_hash = hash_password(password)
    query = text(
        """
        INSERT INTO users (username, password_hash, admin)
        VALUES (:username, :password_hash, :admin)
        RETURNING username, admin
    """
    )
    query_params = {
        "username": username,
        "password_hash": password_hash,
        "admin": admin,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))


@users_bp.route("/users/<username>", methods=["PUT", "DELETE"])
@auth("admin")
def single_user_view(username):
    if request.method == "PUT":
        return _update_user(username, request)
    elif request.method == "DELETE":
        return _delete_user_by_username(username)


@users_bp.route("/users/<username>", methods=["GET"])
@auth("user")
def get_user_by_username(username):
    return _get_user_by_username(username)


@exclude_keys(("password_hash"))
def _get_user_by_username(username):
    query = text(
        """
        SELECT * FROM users
        WHERE username = :username
    """
    )
    query_params = {
        "username": username,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))


def _update_user(username, request):
    password = request.json.get("password")
    admin = request.json.get("admin")
    updates = {}
    if password is not None:
        updates["password_hash"] = hash_password(password)
    if admin is not None:
        updates["admin"] = admin
    if updates:
        query = text(
            """
            UPDATE users
            SET {updates}
            WHERE username = :username
            RETURNING *
        """.format(
                updates=", ".join(f"{k} = :{k}" for k in updates)
            )
        )
        query_params = {
            "username": username,
            **updates,
        }
        with db.get_connection() as conn:
            res = conn.execute(query, query_params)
            return dict(zip(res.keys(), res.first()))
    return {"message": "received empty request body"}, 400


def _delete_user_by_username(username):
    query = text(
        """
        DELETE FROM users
        WHERE username = :username
        RETURNING *
    """
    )
    query_params = {
        "username": username,
    }
    with db.get_connection() as conn:
        res = conn.execute(query, query_params)
        return dict(zip(res.keys(), res.first()))
