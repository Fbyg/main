from flask import Blueprint, request, render_template, redirect
from app.db import get_db

auth = Blueprint("auth", __name__)

@auth.route("/")
def login_page():
    return render_template("login.html")

@auth.route("/login", methods=["POST"])
def login():
    user = request.form["user"]
    pwd = request.form["password"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "SELECT * FROM usuarios WHERE usuario=%s AND password=%s",
        (user, pwd)
    )

    result = cursor.fetchone()

    if result:
        return redirect("/dashboard")

    return "Login incorrecto"


@auth.route("/register", methods=["POST"])
def register():
    user = request.form["user"]
    pwd = request.form["password"]

    db = get_db()
    cursor = db.cursor()

    cursor.execute(
        "INSERT INTO usuarios (usuario, password, provider) VALUES (%s,%s,%s)",
        (user, pwd, "local")
    )

    db.commit()

    return "Usuario creado"