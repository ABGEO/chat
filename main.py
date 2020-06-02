import os

import tornado.ioloop
import tornado.web

from tornado.options import define, options

define("port", default=8000, help="run on the given port", type=int)
define("debug", default=True, help="run in debug mode")


class ChatHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("chat.html")


if __name__ == "__main__":
    app = tornado.web.Application(
        [
            (r"/", ChatHandler),
        ],
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        debug=options.debug,
    )
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()
