from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.websocket import *
import tornado.web
import os
import sys
import math
import random
import json
clients = []


class GameHandler():
    def __init__(self):
        self.world = self.genWorld()
        print("game started")
        self.genWorld()

    def genWorld(self):
        world = []
        for xxx in range(0, 500):
            box = {"x": 0, "y": 0, "z": 0, "mat": 0}
            box["x"] = math.floor(random.random() * 20 - 10) * 20
            box["y"] = math.floor(random.random() * 20) * 20 + 10
            box["z"] = math.floor(random.random() * 20 - 10) * 20
            box["mat"] = 0
            world.append(box)
        return world

    def getWorld(self):
        return ["world"]+self.world

    def removeXYZ(self, x, y, z):
        iErrorCheck = 0
        for index in range(0, 5):
            try:
                mygame.world.remove({'x': x, 'y': y, 'z': z, 'mat': index})
            except ValueError:
                iErrorCheck += 1
        return True if iErrorCheck == 4 else False

    def addXYZM(self, x, y, z, m):
        mygame.world.append({'x': x, 'y': y, 'z': z, 'mat': m})
        return True


mygame = GameHandler()


class MainHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        clients.append(self)
        self.set_nodelay(True)
        print("WebSocket opened")
        self.write_message(str(len(clients)).encode())

    def on_message(self, message):
        print(message)
        msg = message.split()
        if msg[0] == "close":
            IOLoop.current().stop()
        if msg[0] == "world":
            self.write_message(json.dumps(mygame.getWorld()).encode())
        elif msg[0] == "delete":
            self.write_message(u"success" if mygame.removeXYZ(
                int(msg[1]), int(msg[2]), int(msg[3])) else b"fail")

            for clientt in clients:
                clientt.write_message(message)

        elif msg[0] == "append":
            self.write_message(u"success" if mygame.addXYZM(
                int(msg[1]), int(msg[2]), int(msg[3]), int(msg[4])) else b"fail")

            for clientt in clients:
                clientt.write_message(message)

    def on_close(self):
        clients.remove(self)
        print("WebSocket closed")

    def on_pong(self, value):
        pass
        #print("pong answer from %s %s" % (self.request.remote_ip,value))

    def check_origin(self, origin):
        return True


class PingHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        self.write_message(str(len(clients)).encode())

    def check_origin(self, origin):
        return True


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ping", PingHandler)
    ], websocket_ping_interval=5)


if sys.platform == 'win32':
    http_server = HTTPServer(make_app(), ssl_options={
        # letsencrypt.org will help you, bro
        "certfile": os.path.join("d:/PEM/certificate.crt"),
        "keyfile": os.path.join("d:/PEM/private.key"),
    })
elif sys.platform == 'linux':
    http_server = HTTPServer(make_app(), ssl_options={
        "certfile": os.path.join("/home/pi/Документы/PEM/certificate.crt"),
        "keyfile": os.path.join("/home/pi/Документы/PEM/private.key"),
    })

http_server.listen(25555)

# IOLoop.current().add_callback(GameHandler())
IOLoop.current().start()
