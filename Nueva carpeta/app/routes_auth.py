from flask import Blueprint, redirect, session, render_template, url_for
from app.extensions import oauth

auth = Blueprint("auth", __name__)

KEYCLOAK_URL = "http://10.10.88.5:8080"
REALM = "prueba"

keycloak = oauth.register(
    name="keycloak",
    client_id="cliente",
    client_secret="YOUR_SECRET",
    server_metadata_url=f"{KEYCLOAK_URL}/realms/{REALM}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid profile email"},
)


@auth.route("/")
def home():
    if "user" in session:
        return redirect(url_for("auth.dashboard"))
    return render_template("login.html")


@auth.route("/login")
def login():
    return keycloak.authorize_redirect(
    redirect_uri="http://10.10.88.5:5000/callback"
)


@auth.route("/callback")
def callback():
    token = keycloak.authorize_access_token()

    # ✔ forma correcta
    userinfo = token.get("userinfo")

    if not userinfo:
        userinfo = keycloak.userinfo(token=token)

    session["user"] = {
        "username": userinfo.get("preferred_username"),
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
    }

    return redirect(url_for("auth.dashboard"))


@auth.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("auth.login"))

    return render_template("dashboard.html", user=session["user"])


@auth.route("/logout")
def logout():
    session.clear()

    return redirect(
        f"{KEYCLOAK_URL}/realms/{REALM}/protocol/openid-connect/logout"
        f"post_logout_redirect_uri=http://10.10.88.5:5000/"
    )