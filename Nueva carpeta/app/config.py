import os

class Config:
    MYSQL_HOST = "localhost"
    MYSQL_USER = "app_user"
    MYSQL_PASSWORD = "app_password"
    MYSQL_DB = "app_db"
    MYSQL_PORT = 3306

    # OAuth Microsoft
    CLIENT_ID = "TU_CLIENT_ID"
    CLIENT_SECRET = "TU_SECRET"
    TENANT_ID = "common"
    REDIRECT_URI = "http://localhost:5000/callback"