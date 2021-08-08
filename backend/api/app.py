import logging
import os
import yaml

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


# TODO: create an app for production
