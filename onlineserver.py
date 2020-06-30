from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.websocket import *
import tornado.web
import os,sys


clientlist=[]
'''
{    IP address     connection time
    "192.168.0.1":"12:00:01"],
    "localhost":13:35:43"]
}
'''



class GameHandler():
    def __init__(self):
        print("game started")




class MainHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        #self.set_nodelay(True)
        print("WebSocket opened")

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def on_close(self):
        print("WebSocket closed")
    def on_pong(self,value):
        print("pong answer from %s %s" % (self.request.remote_ip,value))
    def check_origin(self, origin):
        return True


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ],websocket_ping_interval=5)




if sys.platform=='win32':
    http_server = HTTPServer(make_app(),ssl_options = {
    "certfile": os.path.join("d:/PEM/certificate.crt"),#letsencrypt.org will help you, bro
    "keyfile": os.path.join("d:/PEM/private.key"),
    })
elif sys.platform=='linux':
   http_server = HTTPServer(make_app(),ssl_options = {
    "certfile": os.path.join("/home/pi/Документы/PEM/certificate.crt"),
    "keyfile": os.path.join("/home/pi/Документы/PEM/private.key"),
    })

http_server.listen(25555)

#IOLoop.current().add_callback(GameHandler())
IOLoop.current().start()
