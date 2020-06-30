var camera, scene, renderer, controls;
var emitter;
var spawnbee;
var score=0;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = true;
var onloadflag=false;

var object = null;
var animations=[];
var objects=[];
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var color = new THREE.Color();
var warnx=100;
var box=null;

var bbox=new THREE.Box3();
var bzover=new THREE.Box3();
initsys();
initobj();
animate();
clicker();
function initobj(){
var boxGeometry = new THREE.BoxBufferGeometry( 10, 20, 10 );
var boxMaterial = new THREE.MeshLambertMaterial({map:new THREE.TextureLoader().load( '/GrassTop.png' )});
box = new THREE.Mesh( boxGeometry, boxMaterial );
		box.position.x = 0;
		box.position.y = 10;
		box.position.z = warnx;
		scene.add( box );
    miraculous('dinosower',end=function(self){
	
    self.scale.set(2,2,2);//40
    self.position.y=2*0.5;
    self.position.z=0;
    self.position.x=0;
    });
}
if(navigator.userAgent.indexOf('Windows')!=-1){
    for(var x=0;x<document.getElementsByClassName('mobile').length;x++){
        document.getElementsByClassName('mobile')[x].outerHTML=null;
    }}
else{clicker();}



function miraculous(model,end=function(){console.log('Successful loading!');},anim=null,name=null){
    if(name==null){name=model;}
    var loader = new THREE.GLTFLoader();
    loader.load( '/'+model+'.glb', function ( gltf ) {//edrien
        gltf.scene.name=name;
		object=gltf.scene;
        scene.add( gltf.scene );
         if(gltf.animations.length>0 && anim!=null){
            var mixer = new THREE.AnimationMixer( gltf.scene );
            mixer.clipAction(gltf.animations[anim[0]]).play();
        animations.push([mixer,anim[1]]);
        } 
        gltf.scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) { node.castShadow = true; }
        } );
        scene.getObjectByName(model).castShadow = true;
        end(gltf.scene);
    }, undefined, function ( error ) {
        console.error( error );
} );}

function clicker(){
document.getElementsByTagName('canvas')[0].addEventListener('touchmove',function(event){
var rect = event.target.getBoundingClientRect();
var x = Math.round(event.touches[0].pageX - rect.left);
var y = Math.round(event.touches[0].pageY - rect.top);
offsetX=x-lastpointer.x;
offsetY=lastpointer.y-y;
controls.getEuler().y=lastpoint.x+offsetX*-0.01;
controls.getEuler().x=lastpoint.y+offsetY*0.01;
controls.getEuler().x=Math.max(-Math.PI/2,Math.min(Math.PI/2,controls.getEuler().x));

camera.quaternion.setFromEuler( controls.getEuler() );
});

document.getElementsByTagName('canvas')[0].addEventListener('touchstart',function(event){
var rect = event.target.getBoundingClientRect();
var x = Math.round(event.touches[0].pageX - rect.left);
var y = Math.round(event.touches[0].pageY - rect.top);
lastpointer.x=x;
lastpointer.y=y;
lastpoint.y=controls.getEuler().y+0;
lastpoint.x=controls.getEuler().y+0;

console.log('start');
});

document.getElementsByTagName('canvas')[0].addEventListener('touchend',function(event){
lastpoint.y=0;
lastpoint.x=0;
console.log('end');
});
}
//camera.rotation.y+=1
//controls.getPitch().rotation.x-=0.01

function getnamed(name){
    return scene.getObjectByName(name);
}

function onfullscreen(){
var elem = document.body;//getElementsByTagName("canvas")[0];
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  controls.lock();
}

function initsys() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	scene = new THREE.Scene();
	controls = new PointerLockControls( camera );
	var blocker = document.getElementById( 'blocker' );
	blocker.addEventListener( 'click', function () {controls.lock();}, false );
	controls.addEventListener( 'lock', function () {blocker.style.display = 'none';});
	controls.addEventListener( 'unlock', function () {blocker.style.display = 'block';} );
	scene.add( camera );
      var Box2Geometry = new THREE.BoxGeometry(3, 3, 3);
      var Box2Material = new THREE.MeshBasicMaterial({color: 0x00ff00});
/////////////////////////////keycontrol////////////////////////////////
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
            case 70: //f
                onfullscreen();
                break;
		}};

	var onKeyUp = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
            case 36: //home
                camera.position.x=0;
                camera.position.z=0;
                break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}};
	///////////////////////////////////////////////endkey////////////////////
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
    document.getElementById('insert').addEventListener( 'touchend', function(){checkclick(false)}, false );
	document.getElementById('delete').addEventListener( 'touchend', function(){checkclick(true)}, false );
	// floor
	var floorGeometry = new THREE.BoxBufferGeometry( 2000, 0.1, 2000 );
    var floorTexture=new THREE.TextureLoader().load( '/grassTop.png' );
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set( 80, 80 );
	var floorMaterial = new THREE.MeshLambertMaterial({map:floorTexture});//new THREE.MeshLambertMaterial({color:'#aaa'});
    var floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.name='floor';
    floor.receiveShadow = true; 
	scene.add( floor ); 


	// objects
	var light = new THREE.HemisphereLight( 0xeedddd, 0x777788, 0.75 );
	light.position.set( 0.5, 20, 0.75 );
    var light2 = new THREE.PointLight( 0xffffff, 5, 10000,1000 );
    light2.position.set( -30, 100, 120 );
    light2.castShadow = true;
    light2.shadow.mapSize.width = 2048;
    light2.shadow.mapSize.height = 2048;

    
	scene.add( light );
    scene.add( light2 ); 

	renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	window.addEventListener( 'resize', onWindowResize, false );
    document.getElementById('cmdtoggle').addEventListener('touchend',function(){
    if(document.getElementById('console').style.display=='block'){
    document.getElementById('console').style.display='none';
    }else{document.getElementById('console').style.display='block';}
        
    
        
    });
}
function animator(){
    for(var counter=0;counter<animations.length;counter++){
        animations[counter][0].update(animations[counter][1])
    }
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
    var time = performance.now();
    var delta = ( time - prevTime ) / 1000;
    velocity.x -= velocity.x * 8.0 * delta;
    velocity.z -= velocity.z * 8.0 * delta;
    velocity.y -= 9.8 * 90.0 * delta; // 100.0 = mass
    direction.z = Number( moveForward ) - Number( moveBackward );
    direction.x = Number( moveLeft ) - Number( moveRight );
    direction.normalize(); // this ensures consistent movements in all directions
	bbox.setFromObject(box);
	bzover.setFromObject(object);
	warnx=warnx-delta*100+0.001;
	if(bbox.intersectsBox(bzover)){
		score=0;
		warnx=200;
	}	
	if(warnx<=-50){
		warnx=200;
		score+=1;
	}
	document.getElementById('alerter').innerHTML=score;
	box.position.z = -warnx;
    if ( moveForward || moveBackward ) velocity.z -= direction.z * 500.0 * delta;
    if ( moveLeft || moveRight ) velocity.x -= direction.x * 500.0 * delta;
    
    controls.moveRight( velocity.x * delta );
    object.position.y+=velocity.y * delta;
    controls.moveForward( -velocity.z * delta );
	camera.position.y = 15;
    if ( object.position.y < 0 ) {
        velocity.y = 0;
        object.position.y = 0;
        canJump = true;
    }
    
    if (!onloadflag){
        setInterval(function(){
        //document.getElementById('alerter').innerHTML=Math.floor(1000/(performance.now()-prevTime));
    },100)    //fps counter
    onloadflag=true;
    }
    prevTime = time;
    animator();
	renderer.render( scene, camera );
    }

/*
var loader = new THREE.CubeTextureLoader();
  var texture = loader.load([
    'grass.png',
    'grass.png',
    'grass.png',
    'grass.png',
    'grass.png',
    'grass.png',
  ]);
  scene.background = texture;
*/

