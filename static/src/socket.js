import { materials } from "./materials.js";
import * as microutils from "./microutils.js";
function split(string) {
    for (var i = 0; i < string.length; i++) {
        stringArray.push(string[i]);
        if (i != string.length - 1) {
            stringArray.push(" ");
        }
    }
}
var updateWorldFlag = false
export class GameSocket {
    constructor(url = "wss:site9373r.dns-cloud.net:25555") {
        this.url = url;
        this.socket = new WebSocket(url);
        this.playernicks = [];
        this.ownnick=null;
        this.socket.onopen = () => {
            console.log("Соединение установлено.");//как же без копипаст?
            updateWorldFlag = true;
            this.socket.send("mynick");
            this.socket.send("world");
        };

        this.socket.onclose = function (event) {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.warn('Обрыв соединения'); // например, "убит" процесс сервера
                setTimeout(()=>window.location.href="/",1000);
                alert("З'єднання з сервером розірвано\nПерехід на головну сторінку...");
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        this.socket.onmessage = (event)=> {

            console.info("Получены данные " + event.data);
            var splitted = event.data.split(" ")
            if(splitted[0]!="move"){console.log(splitted);}

            if (splitted[0] === "move") {
                if (!this.playernicks.includes(splitted[1]) && splitted[1]!="null") {
                    console.log("new creeper");
                    this.playernicks.push(splitted[1]);
                    microutils.miraculous("newcreeper", (model) => { model.scale.set(20, 20, 20); }, null, splitted[1]);
                }
                else {
                    try{
                    window.scene.getObjectByName(splitted[1]).position.copy(microutils.strXYZ2Vector3(splitted[2], splitted[3], splitted[4]));
                    }
                    catch(TypeError){
                        console.warn("access to unloaded object")
                    }
                }}
                if (splitted[0] === "kick") {
                    window.scene.remove(window.scene.getObjectByName(splitted[1]))
                    window.renderer.renderLists.dispose();
                }
                if (splitted[0] === "nick") {
                    this.ownnick=splitted[1];
                }
                if (splitted[0] === "append") {
                    var geometryy = new THREE.BoxBufferGeometry(20, 20, 20);
                    var voxell = new THREE.Mesh(geometryy, materials[splitted[4]]);
                    voxell.position.copy(microutils.strXYZ2Vector3(splitted[1], splitted[2], splitted[3]))
                    voxell.bbox = new THREE.Box3().setFromObject(voxell);
                    window.scene.add(voxell);
                    window.objects.push(voxell);
                    console.log(voxell);
                }

                if (splitted[0] === "delete") {
                    var myraycaster = new THREE.Raycaster(new THREE.Vector3(parseInt(splitted[1]), parseInt(splitted[2]) + 11, parseInt(splitted[3])), new THREE.Vector3(0, -1, 0), 0, 20);
                    console.log(myraycaster.intersectObjects(window.objects))
                    myraycaster.intersectObjects(window.objects).forEach((el) => {
                        console.log(el.object.position);
                        console.log(microutils.strXYZ2Vector3(splitted[1], splitted[2], splitted[3]));
                        if (el.object.position.equals(microutils.strXYZ2Vector3(splitted[1], splitted[2], splitted[3]))) {
                            var deleteme = objects.indexOf(el.object);
                            console.log(el.object)
                            try {
                                window.objects.splice(deleteme, 1);
                                window.scene.remove(el.object);
                                window.renderer.renderLists.dispose();
                            }
                            catch (TypeError) {
                            }
                        }
                    });
                }
                if (updateWorldFlag == true) {
                    try {
                        if (JSON.parse(event.data)[0] == "world") {
                            updateWorldFlag = false;
                            //window.objects = [];
                            let jsoned = JSON.parse(event.data);
                            var geometryy = new THREE.BoxBufferGeometry(20, 20, 20);
                            for (var x = 1; x < JSON.parse(event.data).length; x++) {

                                var voxell = new THREE.Mesh(geometryy, materials[jsoned[x]["mat"]]);
                                voxell.position.set(parseInt(jsoned[x]["x"]), parseInt(jsoned[x]["y"]), parseInt(jsoned[x]["z"]))
                               // console.log(voxell.position)
                                voxell.bbox = new THREE.Box3().setFromObject(voxell);//куб для зіткнень
                                window.scene.add(voxell);
                                window.objects.push(voxell);
                            }
                        }
                    } catch (SyntaxError) { console.error("JSON fucked again") }
                }
            }

            this.socket.onerror = function (error) {
                console.error("Ошибка " + error.message);
            };
            document.addEventListener('blockDeleted', (params) => {
                try{
                this.socket.send("delete " + params.block.x + " " + params.block.y + " " + params.block.z)
                }
                catch(InvalidStateError){
                    console.warn("socket is not connected yet, can't send it now :(")
                }
            });
            document.addEventListener('blockPlaced', (params) => {
                try{
                this.socket.send("append " + params.block.x + " " + params.block.y + " " + params.block.z + " " + params.block.mat)
            }
            catch(InvalidStateError){
                console.warn("socket is not connected yet, can't send it now :(")
            }
            });
            document.addEventListener('animateEvent', (params) =>{
                try{
                //this.socket.send("move "+this.ownnick+" "+window.camera.position.x+" "+(window.camera.position.y-9)+" "+window.camera.position.z)
            }
            catch(InvalidStateError){
                console.warn("socket is not connected yet, can't send it now :(")
            }
            });
        }
    }
