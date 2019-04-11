from flask_script import Command, Option
from settings.get_config_decorator import GetConfig
from typing import Union
import os

@GetConfig('GunicornServer', 'gunicorn_server')
class GunicornServer(Command):

    description = 'Run the app within Gunicorn'

    def __init__(self, host=None, port=None, workers=None):
        self.host = host
        self.port = port
        self.workers = workers

    def get_options(self):
        return (
            Option('-H', '--host',
                   dest='host',
                   default=self.gunicorn_host),

            Option('-p', '--port',
                   dest='port',
                   type=int,
                   default=self.gunicorn_port),

            Option('-w', '--workers',
                   dest='workers',
                   type=int,
                   default=self.gunicorn_workers),
        )

    def __call__(self, app, host, port, workers):

        from gunicorn import version_info

        if version_info < (0, 9, 0):
            from gunicorn.arbiter import Arbiter
            from gunicorn.config import Config
            arbiter = Arbiter(Config({'bind': "%s:%d" % (host, int(port)),'workers': workers}), app)
            arbiter.run()
        else:
            from gunicorn.app.base import Application

            class FlaskApplication(Application):
                def init(self, parser, opts, args):
                    return {
                        'bind': '{0}:{1}'.format(host, port),
                        'workers': workers
                    }

                def load(self):
                    return app

            FlaskApplication().run()
