import json
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import text

from ..auth import verify_password, generate_jwt
from ..db import db
from ..util.datetime import utc_iso_8601


login_bp = Blueprint("login", __name__)


@login_bp.route("/login", methods=["POST"])
def login():
    username, password = request.json.get("username"), request.json.get("password")
    get_password = text(
        """
        SELECT password_hash, admin
        FROM users
        WHERE username = :username;
    """
    )
    with db.get_connection() as conn:
        res = conn.execute(
            get_password,
            username=username,
        ).first()
        if res:
            password_valid = verify_password(password, res["password_hash"])
        else:
            password_valid = None
        if res and password_valid:
            return jsonify(
                {
                    "success": True,
                    "token": generate_jwt(
                        {
                            "username": username,
                            "expires": utc_iso_8601(datetime.now() + timedelta(days=1)),
                            "admin": res["admin"],
                        }
                    ),
                }
            )
        try:
            res = dict(res)
        except TypeError as e:
            current_app.logger.error(e)
            res = None
        return (
            jsonify(
                {
                    "success": False,
                    "details": json.dumps(
                        {
                            "user_found": bool(res),
                            "password_valid": password_valid,
                        },
                        default=str,
                    ),
                }
            ),
            401,
        )
