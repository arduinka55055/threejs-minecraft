
import "./src/objects.js";//імпорт об'єктів
import "./src/PCcontroller.js"//контроллер на компьютер
import "./src/shooter.js"//пістолет


//import "./src/collisions.js"
///import "./src/mobilecontroller.js"

var PostInitEvent = new Event('postInit');//викликати після завантаження системи для ініціації імпортів(як бібліотеки)
var AnimateEvent = new CustomEvent('animateEvent', {'delta': null})//виклик кожного оновлення (fps)
var prevTime = performance.now();//відлік часу для різниці
var color = new THREE.Color();

window.camera=null;//глобальні об'єкти
window.renderer=null;
window.scene=null;

initsys();
document.dispatchEvent(PostInitEvent);//свій event після прогрузки
animate();








//не треба, але пізніше знадобиться в нових версіях

function miraculous(model,end=function(){console.log('Successful loading!');},anim=null,name=null){
    if(name==null){name=model;}
    var loader = new THREE.GLTFLoader();
    loader.load( '/static/gltf/'+model+'.glb', function ( gltf ) {//edrien
        gltf.window.scene.name=name;
        window.scene.add( gltf.window.scene );
         if(gltf.animations.length>0 && anim!=null){
            var mixer = new THREE.AnimationMixer( gltf.window.scene );
            mixer.clipAction(gltf.animations[anim[0]]).play();
        animations.push([mixer,anim[1]]);
        } 
        gltf.window.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
        } );
        window.scene.getObjectByName(model).castShadow = true;
        end(gltf.window.scene);
    }, undefined, function ( error ) {
        console.error( error );
} );}


function initsys() {

    window.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    window.scene = new THREE.Scene();
    window.scene.add( window.camera );//scene.add добавляє об'єкти
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([  //load pictures with sky texture
      '/static/textures/sky/5.png',//    |#1#|
      '/static/textures/sky/3.png',//    |###|
      '/static/textures/sky/1.png',// #3#|#4#|#5#|#6#|
      '/static/textures/sky/2.png',// ###|###|###|###|
      '/static/textures/sky/4.png',//    |#2#|
      '/static/textures/sky/6.png',//    |###|
    ]);
    texture.minFilter=THREE.LinearFilter;
    window.scene.background = texture;

	window.renderer = new THREE.WebGLRenderer( { antialias: true } );//ініціація рендеру
    window.renderer.shadowMap.enabled = true;//тінь
    window.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    window.renderer.setPixelRatio( window.devicePixelRatio );
	window.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( window.renderer.domElement );
    //ініціювати основу гри. камера, рендер

	window.addEventListener( 'resize', function() {
        window.camera.aspect = window.innerWidth / window.innerHeight;
        window.camera.updateProjectionMatrix();
        window.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );//при зміні розміру вікна - змінювати розмір і відношення сторін
}


function animate() {//кожен раз на fps
	requestAnimationFrame( animate );
    var time = performance.now();//перерахунок нового часу
    var delta = ( time - prevTime ) / 1000;//перерахунок різниці часу між оновленням кадру
	
	
	AnimateEvent.delta=delta;//передача аргументу 
	document.dispatchEvent(AnimateEvent);//виклик event. все відбувається тут
    prevTime = time;
	window.renderer.render( window.scene, window.camera );
}

/*
actually it is 2.0 alpha version with refactored code
*/

//https://habr.com/ru/post/183908/ про quartenion