from flask import Blueprint

healthcheck_bp = Blueprint("healthcheck", __name__)


@healthcheck_bp.route("/healthcheck")
def healthcheck():
    return "healthy", 200
