from tornado.wsgi import WSGIContainer
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
import tornado.log
import tornado.autoreload
from mainsrv import app

import logging,os,sys

tornado.autoreload.start()
tornado.log.access_log.setLevel(logging.INFO)



if sys.platform=='win32':
    http_server = HTTPServer(WSGIContainer(app),ssl_options = {
    "certfile": os.path.join("d:/PEM/certificate.crt"),
    "keyfile": os.path.join("d:/PEM/private.key"),
    })
elif sys.platform=='linux':
   http_server = HTTPServer(WSGIContainer(app),ssl_options = {
    "certfile": os.path.join("/home/pi/Документы/PEM/certificate.crt"),
    "keyfile": os.path.join("/home/pi/Документы/PEM/private.key"),
    })

http_server.listen(25555)
IOLoop.instance().start()
