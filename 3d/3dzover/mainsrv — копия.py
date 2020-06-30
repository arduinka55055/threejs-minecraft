from flask import Flask,redirect,Response,request,render_template,make_response
import socket
hostIP=socket.gethostbyname_ex(socket.gethostname())[2][0]
print(hostIP)
app=Flask(__name__)
@app.route('/')
def main():
    return open('main.html').read()

@app.route('/<path>',methods=['GET','POST'])
def pather(path):
    if path=='game':
        return open("index.html",'rb').read()
    if path.endswith('js'):
        return Response(open(path,'rb').read(),mimetype='text/javascript')
    else:
        return open(path,'rb').read()
app.run(ssl_context=('d:/PEM/site9373r.dns-cloud.net-crt.pem','d:/PEM/site9373r.dns-cloud.net-key.pem'),host="192.168.0.100", debug=False,port=443)