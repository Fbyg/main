from flask import Flask
from .extensions import oauth

def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.secret_key = "super-secret"

    oauth.init_app(app)
    app.config["PREFERRED_URL_SCHEME"] = "http"

    app.config.update(
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False
)


    from .routes_auth import auth
    app.register_blueprint(auth)

    return app