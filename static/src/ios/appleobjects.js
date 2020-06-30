import {materials} from "./applematerials.js";
export var objects = [];
document.addEventListener('postInit',function(){
	var boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
	var cubeMaterial = materials[0];
	for (var i = 0; i < 500; i++) {
			var box = new THREE.Mesh(boxGeometry, cubeMaterial);
			box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
			box.position.y = Math.floor(Math.random() * 20) * 20 + 10; //Math.floor( Math.random() * 20 ) * 20 + 10;
			box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
			window.scene.add(box);
			box.bbox = new THREE.Box3().setFromObject(box);
			objects.push(box);
	}
	
var floorGeometry = new THREE.BoxBufferGeometry( 2000, 0.1, 2000 );
var floorTexture=new THREE.TextureLoader().load( '/static/textures/apple/grassTop.png' );
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 80, 80 );
var floorMaterial = new THREE.MeshLambertMaterial({map:floorTexture});//new THREE.MeshLambertMaterial({color:'#aaa'});
var floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.name='floor';
floor.receiveShadow = true; 
scene.add( floor ); 


var light = new THREE.HemisphereLight( 0xeedddd, 0x777788, 0.75 );
light.position.set( 0.5, 20, 0.75 );
var light2 = new THREE.PointLight( 0xffffff, 5, 10000,1000 );
light2.position.set( -30, 100, 120 );
light2.castShadow = true;
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;

scene.add( light );
scene.add( light2 ); 
window.objects=objects;
});