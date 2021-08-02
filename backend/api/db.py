import os

from sqlalchemy import create_engine


class DatabaseClient:
    def __init__(self, db, user, password, host, port, dialect="postgresql"):
        self.db = db
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.dialect = dialect

    @property
    def connection_string(self):
        return f"{self.dialect}://{self.user}:{self.password}@{self.host}:{self.port}/{self.db}"

    def get_engine(self):
        return create_engine(self.connection_string)

    def get_connection(self):
        return self.get_engine().connect()

    def transaction(self):
        return self.get_engine().begin()


environments = frozenset(["dev", "test", "prod"])


def create_database_client(env="prod"):
    if env not in environments:
        raise ValueError("Invalid environment {env!r}.")
    try:
        return DatabaseClient(
            os.environ["POSTGRES_DB"] + ("" if env == "prod" else f"_{env}"),
            os.environ["POSTGRES_USER"],
            os.environ["POSTGRES_PASSWORD"],
            os.environ["POSTGRES_HOST"],
            os.environ["POSTGRES_PORT"],
        )
    except KeyError as e:
        raise EnvironmentError(f"Unset environment variable for postgres client.\n\tError: {e}")


db = create_database_client()

test_db = create_database_client("test")
