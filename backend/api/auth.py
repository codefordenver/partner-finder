import os
from functools import wraps
from datetime import datetime

from passlib.hash import pbkdf2_sha256
from jose import jwt
from flask import request, jsonify, current_app
from sqlalchemy import text

from .db import db
from .util.datetime import from_iso_8601, to_utc


SECRET_KEY = os.environ.get('SECRET_KEY')
if SECRET_KEY is None:
    raise EnvironmentError('Unset environment variable "SECRET_KEY"')


def hash_password(password):
    return pbkdf2_sha256.hash(
        password
    )


def verify_password(password, hash):
    return pbkdf2_sha256.verify(password, hash)


def generate_jwt(payload):
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm='HS256',
    )


def decode_jwt(token):
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=['HS256'],
    )


def _auth_failure_response():
    with current_app.app_context():
        return jsonify({
            'message': 'Invalid or missing authorization header',
        }), 401


def auth(role):

    def decorator(view):

        @wraps(view)
        def decorated_view(*args, **kwargs):

            auth_header = request.headers.get('Authorization')
            if isinstance(auth_header, str) and auth_header.startswith('Bearer '):
                try:
                    token = auth_header.split(' ')[1]
                    credentials = decode_jwt(token)
                    if _credentials_valid(credentials, role):
                        return view(*args, **kwargs)
                    return _auth_failure_response()
                except IndexError as e:
                    current_app.logger.error(repr(e))
                    return _auth_failure_response()

            return _auth_failure_response()

        return decorated_view

    return decorator


def _credentials_valid(credentials, role) -> bool:
    if not isinstance(role, str):
        raise TypeError('"role" parameter must be a string')
    username = credentials.get('username')
    if username is None:
        return False
    expires = credentials.get('expires')
    if expires is None:
        return False
    try:
        expires_dt = from_iso_8601(expires)
    # TODO: replace with more specific exceptions
    except Exception as e:
        current_app.logger.error(repr(e))
        return False
    current_app.logger.info(f'token expiration: {expires_dt!r}')
    current_dt = to_utc(datetime.now())
    current_app.logger.info(f'current datetime: {current_dt}')
    if expires_dt < current_dt:
        return False
    admin = credentials.get('admin')
    if not isinstance(admin, bool):
        return False
    if role.lower() == 'admin' and not admin:
        return False

    return True
