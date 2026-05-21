from flask import Blueprint, redirect, url_for, session, render_template
from datetime import timedelta
import os
from app.extensions import oauth
import psutil
from flask import request

auth = Blueprint("auth", __name__)

# 🔐 Config sesión Flask
def init_app(app):
    app.permanent_session_lifetime = timedelta(minutes=30)


# 🔐 KEYCLOAK CLIENT
keycloak = oauth.register(
    name="keycloak",
    client_id="cliente",
    client_secret="YOUR_CLIENT_SECRET",
    server_metadata_url = "http://localhost:8080/realms/prueba/.well-known/openid-configuration",
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

    session.clear()  # 🔥 FIX SESSION FIXATION

    session.permanent = True

    session["user"] = {
        "sub": userinfo.get("sub"),
        "username": userinfo.get("preferred_username"),
        "email": userinfo.get("email"),
        "name": userinfo.get("name"),
        "roles": userinfo.get("realm_access", {}).get("roles", [])
    }
    session["id_token"] = token.get("id_token")
    session["access_token"] = token.get("access_token")

    return redirect(url_for("auth.dashboard"))


# 📊 DASHBOARD
@auth.route("/dashboard")
def dashboard():

    if "user" not in session:
        return redirect(url_for("auth.login"))

    ip = request.headers.get("X-Forwarded-For", request.remote_addr)

    return render_template(
        "dashboard.html",
        user=session["user"],
        ip=ip
    )


# 🚪 LOGOUT (IMPORTANTE CORREGIDO)
@auth.route("/logout")
def logout():

    id_token = session.get("id_token")
        
    if not id_token:
         return redirect("/")

    session.clear()

    return redirect(
    "http://localhost:8080/realms/prueba/protocol/openid-connect/logout"
    "?post_logout_redirect_uri=http://localhost:5000/"
)

    
def require_login():
    if "user" not in session:
        return False
    return True


@auth.route("/api/ip")
def api_ip():

    if not require_login():
        return {"error": "unauthorized"}, 401

    ip = request.headers.get("X-Forwarded-For", request.remote_addr)

    return {"ip": ip}


@auth.route("/api/memory")
def memory():

    if "user" not in session:
        return {"error": "unauthorized"}, 401

    process = psutil.Process(os.getpid())
    mem_mb = process.memory_info().rss / 1024 / 1024

    return {"memory_mb": round(mem_mb, 2)}