import os
import hashlib


def generate_salt():
    return os.urandom(32)


def hash_password(password, salt=None):
    if salt is None:
        salt = generate_salt()
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000,
    )
    return password_hash, salt

