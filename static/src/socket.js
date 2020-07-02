
import {materials} from "./materials.js";
function split(string) {
    for (var i = 0; i < string.length; i++) {
        stringArray.push(string[i]);
        if (i != string.length - 1) {
            stringArray.push(" ");
        }
    }
}

export class GameSocket {
    constructor(url = "wss:site9373r.dns-cloud.net:25555") {
        this.url = url;
        this.socket = new WebSocket(url);
        this.socket.onopen = function () {
            console.log("Соединение установлено.");
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
            if (splitted[0] == "add") {
                var geometryy = new THREE.BoxBufferGeometry(20, 20, 20);
                var voxell = new THREE.Mesh(geometryy, materials[splitted[4]]);
                voxell.position.set(parseInt(splitted[1]), parseInt(splitted[2]), parseInt(splitted[3]))
                window.scene.add(voxell);
                console.log(voxell)
            }
        };

        this.socket.onerror = function (error) {
            console.error("Ошибка " + error.message);
        };

        
    }
}
