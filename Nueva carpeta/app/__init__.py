from flask import Flask

def create_app():
    app = Flask(
        __name__,
        template_folder="../templates"  # 👈 CLAVE
    )
    

    from .routes_auth import auth
    app.register_blueprint(auth)
    
    from .routes_microsoft import microsoft
    app.register_blueprint(microsoft)
    return app