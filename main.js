//Import important modules{% if device %} {# двойной агент, сунуть чо надо #}
import "./static/src/objects.js";//імпорт об'єктів
import "./static/src/PCcontroller.js"//контроллер на компютер
import "./static/src/shooter.js"//пістолет
//end{% else %}
import "./static/src/objects.js";//імпорт об'єктів
import "./static/src/mobilecontroller.js"//контроллер на мобілку
import "./static/src/friendlyerror.js"
//end{% endif %}
dd
import { GameSocket } from "./static/src/socket.js";

var PostInitEvent = new Event('postInit');//викликати після завантаження системи для ініціації імпортів(як бібліотеки)
var AnimateEvent = new CustomEvent('animateEvent', { 'delta': null })//виклик кожного оновлення (fps)
var prevTime = performance.now();//відлік часу для різниці

window.camera = null;//глобальні об'єкти
window.renderer = null;
window.scene = null;
window.objects = [];

initsys();
var sck = new GameSocket()
document.dispatchEvent(PostInitEvent);//свій event після прогрузки
animate();







function initsys() {

    window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    window.scene = new THREE.Scene();
    window.scene.add(window.camera);//scene.add добавляє об'єкти
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([  //load pictures with sky texture
        '/static/textures/sky/5.png',//    |#1#|
        '/static/textures/sky/3.png',//    |###|
        '/static/textures/sky/1.png',// #3#|#4#|#5#|#6#|
        '/static/textures/sky/2.png',// ###|###|###|###|
        '/static/textures/sky/4.png',//    |#2#|
        '/static/textures/sky/6.png',//    |###|
    ]);
    texture.minFilter = THREE.LinearFilter;
    window.scene.background = texture;

    window.renderer = new THREE.WebGLRenderer({ antialias: true });//ініціація рендеру
    window.renderer.shadowMap.enabled = true;//тінь
    window.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    window.renderer.setPixelRatio(window.devicePixelRatio);
    window.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(window.renderer.domElement);
    //ініціювати основу гри. камера, рендер

    window.addEventListener('resize', function () {
        window.camera.aspect = window.innerWidth / window.innerHeight;
        window.camera.updateProjectionMatrix();
        window.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);//при зміні розміру вікна - змінювати розмір і відношення сторін
}


function animate() {//кожен раз на fps
    requestAnimationFrame(animate);
    var time = performance.now();//перерахунок нового часу
    var delta = (time - prevTime) / 1000;//перерахунок різниці часу між оновленням кадру


    AnimateEvent.delta = delta;//передача аргументу 
    document.dispatchEvent(AnimateEvent);//виклик event. все відбувається тут
    prevTime = time;
    window.renderer.render(window.scene, window.camera);
}

/*
actually it is 2.0 alpha version with refactored code
*/

//https://habr.com/ru/post/183908/ про quartenion