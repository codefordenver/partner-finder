"""Creates a new user given a username and a password.add()

Usage:

From the backend directory, run

python ./database/setup_user.py <your-username> <your-password>
"""


import click
from sqlalchemy import text

from api.auth import hash_password
from api.db import db


@click.command()
@click.argument("username", nargs=1)
@click.argument("password", nargs=1)
def setup_user(username, password):
    query = text(
        """
        INSERT INTO users (username, password_hash, admin)
        VALUES (:username, :password_hash, false);
    """
    )
    with db.get_connection() as conn:
        conn.execute(
            query,
            username=username,
            password_hash=hash_password(password),
        )
    print("success!")


if __name__ == "__main__":
    setup_user()
