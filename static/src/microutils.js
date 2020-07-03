export function miraculous(model, end = function () { console.log('Successful loading!'); }, anim = null, name = null) {
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
        window.scene.getObjectByName(model).castShadow = true;
        end(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });
}

export function strXYZ2Vector3(x,y,z){
    return new THREE.Vector3(parseInt(x),parseInt(y),parseInt(z))
}
