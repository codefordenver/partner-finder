from api.app import dev_app
from tasks import create_dev_users, drop_dev_users


if __name__ == "__main__":
    with dev_app.app_context():
        print("Dropping existing dev users")
        drop_dev_users()
        print("Creating dev users")
        create_dev_users()
