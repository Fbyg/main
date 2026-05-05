from flask import Blueprint, render_template, request, redirect, url_for, session
import msal
from app.config import Config

microsoft = Blueprint('microsoft', __name__)

@microsoft.route("/login/microsoft")
def microsoft_login():
    msal_app = msal.ConfidentialClientApplication(
        Config.CLIENT_ID,
        authority = f"https://login.microsoftonline.com/{Config.TENANT_ID}",
        client_credential = Config.CLIENT_SECRET
    )
    
    auth_url = msal_app.get_authorization_request_url(
        scopes = ["User.Read"],
        redirect_uri = Config.REDIRECT_URI
    )
    
    return redirect(auth_url)

@microsoft.route("/callback")
def callback():

    code = request.args.get("code")

    msal_app = msal.ConfidentialClientApplication(
        Config.CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{Config.TENANT_ID}",
        client_credential=Config.CLIENT_SECRET
    )

    token = msal_app.acquire_token_by_authorization_code(
        code,
        scopes=["User.Read"],
        redirect_uri=Config.REDIRECT_URI
    )

    user = token.get("id_token_claims")

    return f"Bienvenido {user['name']}"

