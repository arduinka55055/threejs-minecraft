from flask import Flask,request,redirect,Response,render_template,make_response
import socket,os
cwd=os.path.dirname(os.path.realpath(__file__))
app=Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 60*60
@app.route('/game')
def main():
    try:
        platform=request.user_agent.platform.lower()
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
@app.route("/src.zip")
def aa():
    return Response(open(cwd+"/src.zip",'rb').read(),mimetype='application/zip')
#app.run(ssl_context=('/home/pi/Документы/PEM/certificate.crt','/home/pi/Документы/PEM/private.key'),host="192.168.0.101", debug=True,port=443)