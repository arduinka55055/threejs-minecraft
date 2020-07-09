from flask import Flask, request, redirect, Response, render_template, make_response
import socket
import os
import json
import hashlib
import asyncio
import websockets
cwd = os.path.dirname(os.path.realpath(__file__))
app = Flask(__name__, template_folder=cwd)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 60*60
app.config['TEMPLATES_AUTO_RELOAD'] = True

serverslist = []
#    {
#        "name": "Official server #1",
#        "ip": "site9373r.dns-cloud.net",
#        "maxplayers": 10
#    }



async def validateServer(uri,srvname,maxplayers):
    try:
        # uri = "wss://localhost:25555" копипасточка!
        connection=await asyncio.wait_for(websockets.connect(uri+"/ping"), 8)
        await connection.send("ok")
        addthis={
            "name":srvname,
            "ip":uri,
            "maxplayers":maxplayers
        }
        if not addthis in serverslist:
            serverslist.append(addthis)
    except Exception as fuckException:
        print(fuckException)
        print("Failed to validate %s" % uri)


@app.route("/newserver", methods=["post"])
def appendNewServer():
    ip = request.values.get("ip")
    asyncio.get_event_loop().create_task(validateServer(ip,request.values.get("name"),request.values.get("maxplayers")))
    return ip


@app.route('/game')
def maingame():
    try:
        platform = request.user_agent.platform.lower()
        print("\033[92m"+platform+"\033[0m")
        if platform == "windows" or platform == "linux":
            return open(cwd+'/index.html').read()
        elif platform == "android":
            return open(cwd+'/indexmobile.html').read()
        elif platform == "iphone":
            return open(cwd+'/indexios.html').read()
        else:
            return "you're very specific person! wait for updates or change device!"
    except:
        return open(cwd+'/index.html').read()

@app.route('/main.js')
def mainjs():
    try:
        platform = request.user_agent.platform.lower()
        print("\033[92m"+platform+"\033[0m")
        if platform == "windows" or platform == "linux":
            return Response(render_template('main.js',device=1), mimetype='text/javascript')
        elif platform == "android":
            return Response(render_template('main.js',device=0), mimetype='text/javascript')
        else:
            return "you're very specific person! wait for updates or change device!"
    except:
        return Response(render_template('main.js',device=1), mimetype='text/javascript')

@app.route('/')
def servers():
    return render_template("serverwindow.html", servers=serverslist, sha1=hashlib.sha1)


@app.route("/src.zip")
def aa():
    return Response(open(cwd+"/src.zip", 'rb').read(), mimetype='application/zip')
#app.run(ssl_context=('/home/pi/Документы/PEM/certificate.crt','/home/pi/Документы/PEM/private.key'),host="192.168.0.101", debug=True,port=443)
