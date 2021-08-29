import logging
import os
import yaml
import json
import re
from typing import Optional, Dict

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
    swagger_template: Optional[Dict] = None,
    swagger_variables: Optional[Dict] = None,
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
        # replace variables in swagger yaml
        if swagger_variables:
            template_str = json.dumps(swagger_template)
            for var, repl in swagger_variables.items():
                var = r"\$" + var
                template_str = re.sub(var, repl, template_str)
            swagger_template = json.loads(template_str)
        Swagger(app, template=swagger_template)

    # TODO: return request metadata as part of responses

    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    return app


def load_swagger_yaml(filename: str) -> Dict:
    swagger_template_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "swagger",
            filename,
        )
    )

    with open(swagger_template_path, "r", encoding="utf-8") as f:
        swagger_template = yaml.load(f, Loader=yaml.FullLoader)

    return swagger_template


def setup_dev_app():
    dev_app = app_factory(
        (healthcheck_bp, leads_bp, login_bp, users_bp, tags_bp),
        logging.DEBUG,
        os.environ["SECRET_KEY"],
        True,
        swagger_template=load_swagger_yaml("dev.yml"),
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
                    f"To authenticate as {username},"
                    f" include this header with the request:\n\tAuthorization:"
                    f" Bearer {token}"
                )
            except KeyError as e:
                dev_app.logger.error(e)
                dev_app.logger.error(
                    f"Could not log in development user. Response:"
                    f" {json.dumps(res_json, indent=2, default=str)}"
                )

    print_auth_headers("user@gmail.com", "password")

    print_auth_headers("admin@gmail.com", "password")

    return dev_app


def setup_prod_app():
    return app_factory(
        (healthcheck_bp, leads_bp, login_bp, users_bp, tags_bp),
        logging.DEBUG,
        os.environ["SECRET_KEY"],
        True,
        swagger_template=load_swagger_yaml("prod.yml"),
        swagger_variables={
            "HOST": os.environ.get("EC2_DNS", "localhost:8000")},
    )


FLASK_ENV = os.environ.get("FLASK_ENV", "production")
if FLASK_ENV.lower() in ("dev", "develop", "development"):
    app = setup_dev_app()
else:
    app = setup_prod_app()
