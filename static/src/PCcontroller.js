import * as controller from "./lib/controlfirst.js";//допоміжна бібліотека з механікою камери
import * as pb from "./PlaceBreak.js"//назва говорить сама за себе
var box = null;
function calcObjIntersection(objects) {
	var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 20);
	raycaster.ray.origin.copy(camera.position);
	raycaster.ray.origin.y -= 20;
	var intersections = raycaster.intersectObjects(objects);
	return intersections.length > 0;
	//як це працює?
	//raycaster посилає промінь, якщо він зіштовхується - то тоді вертаємо true
	//https://threejs.org/docs/index.html#api/en/core/Raycaster
	//це для стрибання
}

document.addEventListener('postInit', function () {
	var controls = new controller.PointerLockControls(window.camera);
	window.controlsIsLocked = function () { return controls.isLocked; };
	var blocker = document.getElementById('blocker');
	blocker.addEventListener('click', function () { controls.lock(); }, false);
	controls.addEventListener('lock', function () { blocker.style.display = 'none'; });
	controls.addEventListener('unlock', function () { blocker.style.display = 'block'; });

	var velocity = new THREE.Vector3();//сила
	var direction = new THREE.Vector3();//напрям

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var canJump = true;

	var onKeyDown = function (event) {
		switch (event.keyCode) {
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
				if (canJump === true) velocity.y += 350;
				canJump = false;
				break;
			case 45: //insert
				pb.checkclick(false);
				break;
			case 46: //delete
				pb.checkclick(true);
				break;
			case 70: //f
				onfullscreen();
				break;
		}
	};

	var onKeyUp = function (event) {
		switch (event.keyCode) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
			case 70: //f
				onfullscreen();
				break;
		}
		switch (event.key) {
			case "Home": //home
				camera.position.x = 0;
				camera.position.z = 0;
				break;
			case "1":
				pb.select(0);//вибір матеріала
				break;
			case "2":
				pb.select(1);
				break;
			case "3":
				pb.select(2);
				break;
			case "4":
				pb.select(3);
				break;
		}
	};

	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);


	var boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
	var cubeMaterial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grass.png') })
	box = new THREE.Mesh(boxGeometry, cubeMaterial);
	box.bbox = new THREE.Box3().setFromObject(box);
	camera.add(box)


	document.addEventListener('animateEvent', function (params) {
		var delta = params.delta;
		velocity.x -= velocity.x * 8.0 * delta;//інерція 
		velocity.z -= velocity.z * 8.0 * delta;
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveLeft) - Number(moveRight);
		direction.normalize(); // this ensures consistent movements in all directions
		/*

		var cameraBBOX=new THREE.Box3().setFromObject(window.camera);

		document.getElementById('alerter').innerHTML="d";
		window.objects.forEach(obj => {
			//obj.bbox=new THREE.Box3().setFromObject(obj);

			if(obj.bbox.intersectsBox(cameraBBOX) == true && 0){
				box.rotation.set(0,0,0);
				//var diff=new THREE.Vector3(window.camera.position.x,window.camera.position.y,window.camera.position.z).multiplyScalar(-1);
				var oldCameraR=new THREE.Vector3();
				oldCameraR.set(camera.rotation.x,camera.rotation.y,camera.rotation.z);
				var diff=new THREE.Vector3(cameraBBOX.getCenter().x,cameraBBOX.getCenter().y,cameraBBOX.getCenter().z);
				var dObj=new THREE.Vector3(obj.bbox.getCenter().x,obj.bbox.getCenter().y,obj.bbox.getCenter().z).multiplyScalar(-1);
				diff.add(dObj);

				//vec.setFromMatrixColumn( window.camera.matrix, 0 );

				//vec.crossVectors( window.camera.up, vec );
		
				//camera.position.addScaledVector( vec, Math.round(diff.x*2.0*delta * 100)/100; );

				//window.camera.position.x+=diff.x*1.2//*delta;
				//window.camera.position.z+=diff.z*1.2//*delta;
				if(diff.x!=0 && diff.z!=0){
				window.camera.position.x+=delta/diff.x*1000;
				window.camera.position.z+=delta/diff.z*1000;}


				//window.camera.position.x=Math.round(window.camera.position.x * 1)/1;
				//window.camera.position.z=Math.round(window.camera.position.z * 1)/1;



				velocity.y+=Math.round(diff.y*5.0*delta * 100)/100;
				if(diff.x>0){
					document.getElementById('alerter').innerHTML+="right";
					//velocity.x+=diff.x*5;
				}
				else{
					document.getElementById('alerter').innerHTML+="left";
					//velocity.x+=diff.x*5;
				}

				if(diff.z>0){
					document.getElementById('alerter').innerHTML+="forward";
					//velocity.z+=diff.z*5;
				}
				else{
					document.getElementById('alerter').innerHTML+="backward";
					//velocity.z+=diff.z*5;
				}

				if(diff.y>0){
					document.getElementById('alerter').innerHTML+="top";
				}
				else{
					document.getElementById('alerter').innerHTML+="bottom";
				}
				//window.camera.rotation.set(oldCameraR.x,oldCameraR.y,oldCameraR.z);
				//window.camera.updateProjectionMatrix();
				
			}
			НАФІГ НІКОМУ НЕ ПОТРІБНЕ ГЛЮКОВО(можливо потім потрібне, для колізії)
			
		});
		*/

		if (moveForward || moveBackward) velocity.z -= direction.z * 500.0 * delta; //500
		if (moveLeft || moveRight) velocity.x -= direction.x * 500.0 * delta;

		if (calcObjIntersection(window.objects) == true) {//вертикальне зіткнення
			//velocity.y = Math.max( 0, velocity.y );
			//canJump = true;
		}



		controls.moveRight(velocity.x * delta);
		window.camera.position.y += velocity.y * delta;
		controls.moveForward(-velocity.z * delta);
		window.camera.position.multiplyScalar(10).round().divideScalar(10)
		if (window.camera.position.y < 25) {//щоб ми не падали
			velocity.y = 0;
			camera.position.y = 25;
			canJump = true;
		}
	});
});