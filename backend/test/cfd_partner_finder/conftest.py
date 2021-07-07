import pytest

from api.app import app as flask_app


@pytest.fixture(scope="session")
def app():
    # setup
    return flask_app
    # teardown


@pytest.fixture(scope="session")
def client(app):
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture(scope="session")
def check_get_request(client):
    def _check_get_request(url, expected_status=200):
        res = client.get(url)
        assert res.status_code == expected_status

    return _check_get_request
