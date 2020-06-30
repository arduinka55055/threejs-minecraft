from flask import Flask,redirect,Response,request,render_template,make_response
import socket,os
app=Flask(__name__)
@app.route('/')
def main():
    return open(os.getcwd()+'/main.html').read()

@app.route('/<path>',methods=['GET','POST'])
def pather(path):
    if path=='game':
        return open(os.getcwd()+"/index.html",'rb').read()
    if path.endswith('js'):
        return Response(open(os.getcwd()+'/'+path,'rb').read(),mimetype='text/javascript')
    else:
        return open(os.getcwd()+'/'+path,'rb').read()
app.run(ssl_context=('d:/PEM/certificate.crt','d:/PEM/private.key'),host="192.168.0.100", debug=False,port=443)