export function miraculous(model, end = function () { console.log('Successful loading!'); }, anim = null, name = null) {
    /**
     @param model просто фігачим ім'я файлу(шляхи і розширения не треба, edrien наприклад)
     @param end функція після прогрузки моделі, можна змінити розміри
     @param anim номер анімації, їх можуть декілька всунути
     @param name ім'я, щоб звертатись після завантаження 
     */
    if (name == null) { name = model; }
    var loader = new THREE.GLTFLoader();
    loader.load('/static/gltf/' + model + '.glb', function (gltf) {//edrien
        gltf.scene.name = name;
        window.scene.add(gltf.scene);
        if (gltf.animations.length > 0 && anim != null) {
            var mixer = new THREE.AnimationMixer(gltf.scene);
            mixer.clipAction(gltf.animations[anim[0]]).play();
            animations.push([mixer, anim[1]]);
        }
        gltf.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) { node.castShadow = true; }
        });
        window.scene.getObjectByName(name).castShadow = true;
        end(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
}

export function strXYZ2Vector3(x,y,z){
    return new THREE.Vector3(parseInt(x),parseInt(y),parseInt(z))
}
