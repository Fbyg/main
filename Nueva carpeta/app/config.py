import os

class Config:
    SECRET_KEY = "dev-secret-secret"

    KEYCLOAK_URL = "http://localhost:8080"
    REALM = "prueba"

    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_COOKIE_SECURE = False

    MYSQL_HOST = "mysql"
    MYSQL_USER = "app_user"
    MYSQL_PASSWORD = "app_password"
    MYSQL_DB = "app_db"
    MYSQL_PORT = 3306