import tkinter as tk
from tkinter import messagebox
import mysql.connector

# 🔌 conexión a MySQL (Docker)
def conectar():
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="app_user",
        password="app_password",
        database="app_db"
    )

# 🔐 validar login
def login():
    user = entry_user.get()
    pwd = entry_pass.get()

    if not user or not pwd:
        messagebox.showwarning("Error", "Completa todos los campos")
        return

    db = conectar()
    cursor = db.cursor()

    cursor.execute(
        "SELECT * FROM usuarios WHERE usuario=%s AND password=%s",
        (user, pwd)
    )

    result = cursor.fetchone()

    cursor.close()
    db.close()

    if result:
        messagebox.showinfo("OK", f"Bienvenido {user}")
        abrir_panel(user)
    else:
        messagebox.showerror("Error", "Usuario o contraseña incorrectos")

# 🧾 registrar usuario (NUEVO)
def register():
    user = entry_user.get()
    pwd = entry_pass.get()

    if not user or not pwd:
        messagebox.showwarning("Error", "Completa todos los campos")
        return

    try:
        db = conectar()
        cursor = db.cursor()

        # comprobar si ya existe
        cursor.execute(
            "SELECT * FROM usuarios WHERE usuario=%s",
            (user,)
        )

        if cursor.fetchone():
            messagebox.showerror("Error", "El usuario ya existe")
            return

        # insertar usuario
        cursor.execute(
            "INSERT INTO usuarios (usuario, password) VALUES (%s, %s)",
            (user, pwd)
        )

        db.commit()

        cursor.close()
        db.close()

        messagebox.showinfo("OK", "Usuario registrado correctamente")

    except mysql.connector.Error as e:
        messagebox.showerror("DB Error", str(e))

# 🧑‍💻 pantalla después del login
def abrir_panel(user):
    panel = tk.Toplevel()
    panel.title("Panel")
    panel.geometry("250x120")

    tk.Label(panel, text=f"Hola {user} 👋").pack(pady=20)

# 🖼 ventana principal
root = tk.Tk()
root.title("Login Python + MySQL")
root.geometry("300x250")

tk.Label(root, text="Usuario").pack(pady=5)
entry_user = tk.Entry(root)
entry_user.pack()

tk.Label(root, text="Contraseña").pack(pady=5)
entry_pass = tk.Entry(root, show="*")
entry_pass.pack()

tk.Button(root, text="Login", command=login).pack(pady=10)

# 🆕 botón de registro
tk.Button(root, text="Registrar", command=register).pack(pady=5)

root.mainloop()