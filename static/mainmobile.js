import "./src/objects.js";
//import "./src/PCcontroller.js"
//import "./src/shooter.js"
import "./src/mobilecontroller.js"
import { GameSocket } from "./src/socket.js";
var PostInitEvent = new Event('postInit');
var AnimateEvent = new CustomEvent('animateEvent', {'delta': null})
var prevTime = performance.now();
var color = new THREE.Color();

window.camera=null;
window.renderer=null;
window.scene=null;
window.objects=[];
initsys();
var sck = new GameSocket()
document.dispatchEvent(PostInitEvent);
animate();


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

window.onerror=function(msg, url, line, col, error) {
    var Headerhtml="Oops... serious error here!";
    var html="Sorry for that, error may be fixed if you will contact ";
    var element = document.createElement("div");
    var header = document.createElement("div");
    var url = document.createElement("a");
    var textnode = document.createTextNode(html);
    var textHeader = document.createTextNode(Headerhtml);
    var errorContainer = document.createElement("div");
    var errormsg = document.createTextNode(msg+" "+url);
    var errorpos = document.createTextNode("Position: "+line+" line "+col+" column.");
    var header2 = document.createElement("div");

    var errorCloseT = document.createTextNode("×");
    var errorClose = document.createElement("div");

    header.appendChild(textHeader);
    errorContainer.appendChild(errormsg);
    errorContainer.appendChild(document.createElement("br"));
    errorContainer.appendChild(errorpos);
    errorClose.appendChild(errorCloseT);

    element.appendChild(errorClose);
    element.appendChild(header);
    element.appendChild(textnode);
    element.appendChild(url);
    element.appendChild(header2);
    element.appendChild(errorContainer);
    url.href="/report?err=";
    url.innerHTML="here\n";
    header2.innerHTML="More info:";
    element.id="error";
    header.id="errorH";
    header2.id="errorB";
    errorContainer.id="errorM";
    errorClose.id="errorC";
    document.body.appendChild(element);
    element.addEventListener("touchstart",function(){document.body.removeChild(element);});
}


function initsys() {

    window.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    window.scene = new THREE.Scene();
    window.scene.add( window.camera );
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      '/static/textures/sky/5.png',//    |#1#|
      '/static/textures/sky/3.png',//    |###|
      '/static/textures/sky/1.png',// #3#|#4#|#5#|#6#|
      '/static/textures/sky/2.png',// ###|###|###|###|
      '/static/textures/sky/4.png',//    |#2#|
      '/static/textures/sky/6.png',//    |###|
    ]);
    texture.minFilter=THREE.LinearFilter;
    window.scene.background = texture;

	window.renderer = new THREE.WebGLRenderer( { antialias: true } );
    window.renderer.shadowMap.enabled = true;
    window.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    window.renderer.setPixelRatio( window.devicePixelRatio );
	window.renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( window.renderer.domElement );
	window.addEventListener( 'resize', function() {
        window.camera.aspect = window.innerWidth / window.innerHeight;
        window.camera.updateProjectionMatrix();
        window.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );     

}


function animate() {
	requestAnimationFrame( animate );
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
	AnimateEvent.delta=delta;
	document.dispatchEvent(AnimateEvent);
    prevTime = time;
	window.renderer.render( window.scene, window.camera );
}
function onWindowResize() {
	window.camera.aspect = window.innerWidth / window.innerHeight;
	window.camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

//    \   /
//    (. .)
//   (_____)
//() ####### ()
//() ####### ()
//() ####### ()
//   #######
//    ## ##
//    ## ##
// ANDROID VERSION 2.0

