from api.app import dev_app
from tasks import create_dev_users


if __name__ == '__main__':
    with dev_app.app_context():
        create_dev_users()
