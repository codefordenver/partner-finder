import logging
from time import sleep

from api.db import db
from sqlalchemy.exc import SQLAlchemyError


class DatabaseUnavailable(Exception):
    pass


def wait_for_db(retries=5, sleep_for=1):
    count = 0
    while count <= retries:
        logging.info(f"Waiting for db connection. Attempt {count + 1} / {retries}")
        try:
            db.get_connection()
            return True
        except SQLAlchemyError as e:
            logging.info(e)
            sleep(sleep_for)
            count += 1
    raise DatabaseUnavailable("Could not connect to database.")


if __name__ == "__main__":
    wait_for_db()
