import "./lib/GLTFLoader.js"//завантажувач модельок в спец форматі
import * as pb from "./PlaceBreak.js"
var emitter;
var bullets = [];//масив з кулями

document.addEventListener('postInit', function () {
    var loader = new THREE.GLTFLoader();
    loader.load('/static/gltf/pistol.glb', function (gltf) {
        gltf.scene.scale.set(20, 20, 20);
        gltf.scene.name = 'pis';
        window.camera.add(gltf.scene);
        gltf.scene.position.z -= 5;
        gltf.scene.position.y = -3.5;
        gltf.scene.rotation.y = 1.5;
        emitter = new THREE.Object3D();
        emitter.position.set(0.2, 0.1, 15)
        window.camera.add(emitter);

        var crossgeometry = new THREE.Geometry();
        crossgeometry.vertices.push(new THREE.Vector3(0, 0.1, 0));
        crossgeometry.vertices.push(new THREE.Vector3(0, -0.1, 0));
        crossgeometry.vertices.push(new THREE.Vector3(0, 0, 0));
        crossgeometry.vertices.push(new THREE.Vector3(0.1, 0, 0));//приціл
        crossgeometry.vertices.push(new THREE.Vector3(-0.1, 0, 0));
        var crossmaterial = new THREE.LineBasicMaterial({ color: 0xe00808 });
        var crosshair = new THREE.Line(crossgeometry, crossmaterial);
        crosshair.position.set(0, 0, -1);
        window.camera.add(crosshair);

        document.addEventListener('mousedown', function (event) {
            if (event.which == 1 && window.controlsIsLocked()) {
                var plasmaBall = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 4), new THREE.MeshBasicMaterial({
                    color: "#222222"
                }));
                plasmaBall.position.copy(emitter.getWorldPosition(new THREE.Vector3(0, 0, 0))); // start position
                var mainQ = new THREE.Quaternion();
                mainQ.copy(window.camera.quaternion);
                plasmaBall.quaternion.copy(mainQ); // apply camera's quaternion
                plasmaBall.bbox = new THREE.Box3().setFromObject(plasmaBall);
                window.scene.add(plasmaBall);
                bullets.push(plasmaBall);
            }
            else if(window.controlsIsLocked()){//друга клавіша ставить блок
                pb.checkclick(0);
            }
        });

    }, undefined, function (error) {
        console.error(error);
    });
});



document.addEventListener('animateEvent', function (params) {
    var delta = params.delta;
    bullets.forEach(b => {//перелік усіх куль
        b.translateZ(-500 * delta); // move along the local z-axis
        b.bbox.setFromObject(b);
        for (var cc = 0; cc < objects.length; cc++) {
            if (objects[cc].bbox.intersectsBox(b.bbox) == true) {//влучив у ціль
                window.scene.remove(objects[cc]);
                window.scene.remove(b);//зникає куля і блок-жертва
                window.objects.splice(cc, 1);
                var indexx = bullets.indexOf(b);
                bullets.splice(indexx, 1);

            }
        }
        b.distanceB += -500 * delta;//рухаємо
        if (b.distanceB <= -1000 || b.distanceB == NaN) {
            window.scene.remove(b)
            bullets.splice(bullets.indexOf(b), 1);
        }//оптимізація, очищаємо кулі за межами 
    });
});






