import json

from flask import Blueprint, current_app, request

from ..auth import hash_password
from ..db import db


login_bp = Blueprint('login', __name__)


@login_bp.route('/login', methods=['POST'])
def login():
    current_app.logger.info('login', json.dumps(request.get_json()))
    username, password = request.json.get('username'), request.json.get('password')
    get_salt = """
        SELECT password_hash, salt
        FROM users
        WHERE username = %s
    """
    login_user = """
        UPDATE users
        SET
            logged_in = %s,
            last_login = %s
        WHERE username = %s;
    """
    with db.get_connection() as conn:
        res = conn.execute(get_salt, [username, ]).first()
        if hash_password(password, res['salt'])[0] == res['password_hash']:
            return "login success"
            # log in user
        return "login failed"