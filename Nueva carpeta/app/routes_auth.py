from flask import Blueprint, redirect, url_for, session, render_template
from app.extensions import oauth

auth = Blueprint("auth", __name__)

# KEYCLOAK CLIENT
keycloak = oauth.register(
    name="keycloak",
    client_id="cliente",
    client_secret="YOUR_CLIENT_SECRET",
    server_metadata_url="http://localhost:8080/realms/mi-realm/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid profile email"
    }
)

# HOME 
@auth.route("/")
def home():
    if "user" in session:
        return redirect("/dashboard")
    return render_template("login.html")

# LOGIN 
@auth.route("/login")
def login():
    redirect_uri = "http://localhost:5000/callback"
    print("REDIRECT URI:", redirect_uri)
    return keycloak.authorize_redirect(redirect_uri)

# CALLBACK 
@auth.route("/callback")
def callback():
    token = keycloak.authorize_access_token()

    userinfo = token.get("userinfo")

    session["user"] = {
        "sub": userinfo["sub"],
        "username": userinfo.get("preferred_username"),
        "email": userinfo.get("email"),
        "roles": userinfo.get("realm_access", {}).get("roles", [])
    }

    return redirect("/dashboard")

# DASHBOARD 
@auth.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect("/login")

    return render_template(
        "dashboard.html",
        user=session["user"]
    )

# LOGOUT
@auth.route("/logout")
def logout():
    session.clear()
    logout = (
        "http://localhost:8080/realms/mi-realm/.well-known/openid-configuration/logout?client_id=cliente&post_logout_redirect_uri=http://localhost:5000/"
    )
    return redirect(logout)