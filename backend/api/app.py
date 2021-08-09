import logging
import os
import yaml
import json

from flasgger import Swagger
from flask import Flask
from flask_cors import CORS

from .blueprints import (
    healthcheck_bp,
    leads_bp,
    login_bp,
    users_bp,
    tags_bp,
)


def app_factory(
    blueprints,
    log_level,
    secret_key,
    allow_cors,
    swagger_template=None,
):
    app = Flask(__name__)
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(log_level)
    app.secret_key = secret_key

    if allow_cors:
        # for localhost development only
        CORS(app)

    if swagger_template:
        Swagger(app, template=swagger_template)

    # TODO: return request metadata as part of responses

    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    return app


dev_swagger_template_path = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "swagger",
        "dev.yml",
    )
)


with open(dev_swagger_template_path, "r", encoding="utf-8") as f:
    dev_swagger_template = yaml.load(f, Loader=yaml.FullLoader)


dev_app = app_factory(
    (healthcheck_bp, leads_bp, login_bp, users_bp, tags_bp),
    logging.DEBUG,
    os.environ["SECRET_KEY"],
    True,
    swagger_template=dev_swagger_template,
)


# authenticate user for dev app and get a bearer token


def print_auth_headers(username, password):
    with dev_app.test_client() as client:
        # get bearer token for a regular user
        res = client.post(
            "/login",
            headers={"Content-Type": "application/json"},
            json={
                "username": username,
                "password": password,
            },
        )
        res_json = res.json
        try:
            token = res_json["token"]
            dev_app.logger.info(
                f"To authenticate as {username}, include this header with the request:\n\tAuthorization: Bearer {token}"
            )
        except KeyError as e:
            dev_app.logger.error(e)
            dev_app.logger.error(
                f"Could not log in development user. Response: {json.dumps(res_json, indent=2, default=str)}"
            )


print_auth_headers("user@gmail.com", "password")


print_auth_headers("admin@gmail.com", "password")


# TODO: create an app for production
