from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify

from ..auth import verify_password, generate_jwt
from ..db import db
from ..util.datetime import utc_iso_8601


login_bp = Blueprint('login', __name__)


@login_bp.route('/login', methods=['POST'])
def login():
    username, password = request.json.get('username'), request.json.get('password')
    get_password = """
        SELECT password_hash, admin
        FROM users
        WHERE username = %s
    """
    with db.get_connection() as conn:
        res = conn.execute(get_password, [username, ]).first()
        if res and verify_password(password, res['password_hash']):
            return jsonify({
                "success": True,
                "token": generate_jwt({
                    'username': username,
                    'expires': utc_iso_8601(datetime.now() + timedelta(days=1)),
                    'admin': res['admin'],
                })
            })
        return jsonify({
            "success": False,
        }), 401
