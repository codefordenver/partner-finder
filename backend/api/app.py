import logging
import os

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
):
    app = Flask(__name__)
    app.logger.setLevel(log_level)
    app.secret_key = secret_key

    if allow_cors:
        # for localhost development only
        CORS(app)

    Swagger(app)

    # TODO: return request metadata as part of responses

    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    return app


dev_app = app_factory(
    (healthcheck_bp, leads_bp, login_bp, users_bp, tags_bp),
    logging.DEBUG,
    os.environ["SECRET_KEY"],
    True,
)


# TODO: create an app for production
