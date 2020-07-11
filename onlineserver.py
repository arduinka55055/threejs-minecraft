from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
from tornado.websocket import *
import tornado.web
import os
import sys
import math
import random
import json
import uuid
import requests
clients = []
print("\033[92mLOCAL GAME SERVER MODE\033[0m" if "local" in sys.argv else None)
myserver = {
    # server name just to display."super nice server, donate only for 0.1$, etc"
    "name": "Official server #1",
    # your global server IP address or domain, you must change it
    # also wss means secured server. If you dont have cert files - remove second 's' character, or better use letsencrypt
    "ip": "wss://site9373r.dns-cloud.net:25555",
    # your server port to bind
    "srvport": 25555,
    # player limit
    "maxplayers": 10
}
if "local" in sys.argv:
    myserver = {
        "name": "Debug server #1",
        "ip": "ws://127.0.0.1:25555",
        "srvport": 25555,
        "maxplayers": 2
    }


async def addMyServer():
    await asyncio.sleep(2)
    requests.post(
        "http://127.0.0.1/newserver" if "local" in sys.argv
        else"https://site9373r.dns-cloud.net/newserver", data=myserver)


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
        self.nick = str(uuid.uuid4())
        for clientt in clients:
            if not clientt == self:
                clientt.write_message(b"move %b 0 20 0" % self.nick.encode())

    def on_message(self, message):
        msg = message.split()

        if not msg[0] == "move":
            print(message)

        if msg[0] == "close":
            IOLoop.current().stop()

        if msg[0] == "world":
            self.write_message(json.dumps(mygame.getWorld()).encode())
        elif msg[0] == "delete":
            self.write_message(u"success" if mygame.removeXYZ(
                int(msg[1]), int(msg[2]), int(msg[3])) else b"fail")

            for clientt in clients:
                if not clientt == self:
                    clientt.write_message(message)
        elif msg[0] == "move":
            for clientt in clients:
                if not clientt == self:
                    clientt.write_message(message)
        elif msg[0] == "mynick":
            self.write_message(b"nick %b" % self.nick.encode())

        elif msg[0] == "append":
            self.write_message(u"success" if mygame.addXYZM(
                int(msg[1]), int(msg[2]), int(msg[3]), int(msg[4])) else b"fail")

            for clientt in clients:
                if not clientt == self:
                    clientt.write_message(message)

    def on_close(self):
        clients.remove(self)
        for clientt in clients:
            clientt.write_message("kick %s" % self.nick)
        print("WebSocket closed")

    def check_origin(self, origin):
        return True


class PingHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        self.write_message(str(len(clients)).encode())

    def check_origin(self, origin):
        return True

    def on_message(self, message):
        print(message)
        if message == "ok":
            print("success!")


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ping", PingHandler)
    ], websocket_ping_interval=5)


if "local" in sys.argv:
    http_server = HTTPServer(make_app())
    os.system('color 0')
    http_server.listen(myserver["srvport"])
else:
    if sys.platform == 'win32':
        http_server = HTTPServer(make_app(), ssl_options={
            "certfile": os.path.join("d:/PEM/certificate.crt"),
            "keyfile": os.path.join("d:/PEM/private.key"),
        })
        os.system('color 0')
        http_server.listen(myserver["srvport"])
    elif sys.platform == 'linux':
        http_server = HTTPServer(make_app(), ssl_options={
            # path to your SSL files
            "certfile": os.path.join("/home/pi/Документы/PEM/certificate.crt"),
            "keyfile": os.path.join("/home/pi/Документы/PEM/private.key"),
        })
        http_server.bind(myserver["srvport"])
        http_server.start(0)

IOLoop.current().add_callback(addMyServer)
IOLoop.current().start()
