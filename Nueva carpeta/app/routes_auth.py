from flask import Blueprint, redirect, url_for, session, render_template
from datetime import timedelta
from app.extensions import oauth

auth = Blueprint("auth", __name__)

# 🔐 Config sesión Flask
def init_app(app):
    app.permanent_session_lifetime = timedelta(minutes=30)


# 🔐 KEYCLOAK CLIENT
keycloak = oauth.register(
    name="keycloak",
    client_id="cliente",
    client_secret="YOUR_CLIENT_SECRET",
    server_metadata_url="http://localhost:8080/realms/mi-realm/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid profile email"
    }
)


# 🏠 HOME
@auth.route("/")
def home():
    if "user" in session:
        return redirect("/dashboard")
    return render_template("login.html")


# 🔑 LOGIN
@auth.route("/login")
def login():
    redirect_uri = "http://localhost:5000/callback"
    return keycloak.authorize_redirect(redirect_uri)


# 🔁 CALLBACK
@auth.route("/callback")
def callback():

    token = keycloak.authorize_access_token()
    userinfo = token.get("userinfo")

    if not userinfo:
        return redirect("/login")

    session.permanent = True

    session["user"] = {
        "sub": userinfo.get("sub"),
        "username": userinfo.get("preferred_username"),
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
        "roles": userinfo.get("realm_access", {}).get("roles", [])
    }

    return redirect(url_for("auth.dashboard"))


# 📊 DASHBOARD
@auth.route("/dashboard")
def dashboard():

    if "user" not in session:
        return redirect(url_for("auth.login"))

    return render_template(
        "dashboard.html",
        user=session["user"]
    )


# 🚪 LOGOUT (IMPORTANTE CORREGIDO)
@auth.route("/logout")
def logout():

    session.clear()

    logout_url = (
        "http://localhost:8080/realms/mi-realm/protocol/openid-connect/logout"
        "?redirect_uri=http://localhost:5000/"
    )

    return redirect(logout_url)