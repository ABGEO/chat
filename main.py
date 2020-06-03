import logging
import os

import tornado.escape
import tornado.ioloop
import tornado.locks
import tornado.web
import tornado.websocket
from tornado.options import define, options

define("port", default=8000, help="run on the given port", type=int)
define("debug", default=True, help="run in debug mode")


class ChatHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("chat.html", messages=ChatSocketHandler.messages)


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters = set()
    messages = []
    messages_size = 200

    def get_compression_options(self):
        return {}

    def open(self):
        ChatSocketHandler.waiters.add(self)

    def on_close(self):
        ChatSocketHandler.waiters.remove(self)

    def on_message(self, message):
        message = tornado.escape.json_decode(message)

        self.messages.append(message)

        if len(self.messages) > self.messages_size:
            self.messages = self.messages[-self.messages_size:]

        for waiter in self.waiters:
            try:
                waiter.write_message(message)
            except:
                logging.error("Error sending message", exc_info=True)


if __name__ == "__main__":
    tornado.options.parse_command_line()
    app = tornado.web.Application(
        [
            (r"/", ChatHandler),
            (r"/chat-socket", ChatSocketHandler),
        ],
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        debug=options.debug,
    )
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()
