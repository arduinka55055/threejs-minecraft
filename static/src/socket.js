import { materials } from "./materials.js";
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

        this.socket.onopen = () => {
            console.log("Соединение установлено.");
            updateWorldFlag = true;
            this.socket.send("world");
        };

        this.socket.onclose = function (event) {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.warn('Обрыв соединения'); // например, "убит" процесс сервера
            }
            console.log('Код: ' + event.code + ' причина: ' + event.reason);
        };

        this.socket.onmessage = function (event) {
            console.info("Получены данные " + event.data);
            var splitted = event.data.split(" ")
            console.log(splitted)
            if (splitted[0] === "append") {
                alert()
                var geometryy = new THREE.BoxBufferGeometry(20, 20, 20);
                var voxell = new THREE.Mesh(geometryy, materials[splitted[4]]);
                voxell.position.set(parseInt(splitted[1]), parseInt(splitted[2]), parseInt(splitted[3]))
                voxell.bbox = new THREE.Box3().setFromObject(voxell);
                window.scene.add(voxell);
                window.objects.push(voxell);
                console.log(voxell);
            }
            if (splitted[0] === "delete") {
                var myraycaster = new THREE.Raycaster(new THREE.Vector3(parseInt(splitted[1]),parseInt(splitted[2])+11,parseInt(splitted[3])), new THREE.Vector3(0, -1, 0), 0, 20);
                console.log(myraycaster.intersectObjects(window.objects))
                myraycaster.intersectObjects(window.objects).forEach((el)=>{
                    if( el.object.position.x==parseInt(splitted[1]) && el.object.position.y==parseInt(splitted[2]) && el.object.position.z==parseInt(splitted[3])){
                        var deleteme = objects.indexOf(el.object);
                        console.log(el.object)
                        window.scene.remove(el.object);
                        window.objects.splice(deleteme, 1);
                    }
                })
                
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
                            console.log(voxell.position)
                            voxell.bbox = new THREE.Box3().setFromObject(voxell);//куб для зіткнень
                            window.scene.add(voxell);
                            window.objects.push(voxell);
                        }
                    }
                } catch (ee) { console.error(ee) }
            }
        };

        this.socket.onerror = function (error) {
            console.error("Ошибка " + error.message);
        };


    }
}
