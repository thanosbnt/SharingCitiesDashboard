from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from resources.analytics import Analytics
from db import db

def create_app(**config_overrides):
    app = Flask(__name__)
    app.config.from_pyfile('settings.py')
    app.config.update(config_overrides)
    api = Api(app)
    
    db.init_app(app)

    from models.operation import Operation
    from models.request_analytics import RequestAnalytics
    from models.request_table_cols import RequestTablesCols
    from models.request_tables import RequestTables
    
    db.create_all()

    migrate = Migrate(app, db)
    api.add_resource(Analytics, '/analytics')

    return app
