import { materials } from "./materials.js";
var blockRemoveEvent = new CustomEvent('blockDeleted', { 'block': null })
var blockPlaceEvent = new CustomEvent('blockPlaced', { 'block': null })
var selectIndex = 0;
document.getElementById('selector').children[0].style.borderColor = "blue";
export function select(index) {//вибір блока
    selectIndex = index;
    for (var iterator = 0; iterator < document.getElementById('selector').children.length; iterator++) {
        document.getElementById('selector').children[iterator].style.borderColor = "yellow";
    }
    document.getElementById('selector').children[index].style.borderColor = "blue";
}


export function checkclick(action) {//використовуємо промінь №2
    var raycaster2 = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, 0, -1), 0, 80);
    raycaster2.set(window.camera.getWorldPosition(new THREE.Vector3(0, 0, 0)), window.camera.getWorldDirection(new THREE.Vector3(0, 0, 0)));
    var intersections2 = raycaster2.intersectObjects(window.objects);
    if (intersections2.length > 0) {//remove object
        if (action == true) {

            var selectedObject = intersections2[0].object;
            blockRemoveEvent.block = { "x": selectedObject.position.x, "y": selectedObject.position.y, "z": selectedObject.position.z }
            console.log(blockRemoveEvent.block)
            document.dispatchEvent(blockRemoveEvent);
            var deleteme = window.objects.indexOf(intersections2[0].object);
            window.scene.remove(selectedObject);
            window.objects.splice(deleteme, 1);
            window.renderer.renderLists.dispose();
        }
        else {
            if (action == false) {
                //////////////create object
                var geometryy = new THREE.BoxBufferGeometry(20, 20, 20);
                var voxel = new THREE.Mesh(geometryy, materials[selectIndex]);
                voxel.position.copy(intersections2[0].object.position).add(intersections2[0].face.normal.multiplyScalar(20));
                voxel.castShadow = true;
                var bugflag = false;
                for (var x = 0; x < window.objects.length; x++) {
                    if (window.objects[x].position.equals(voxel.position) ) { bugflag = true; }
                }
                ///////////////check bug
                if (!bugflag) {
                    
                    window.scene.add(voxel);
                    voxel.bbox = new THREE.Box3().setFromObject(voxel);
                    window.objects.push(voxel);
                    blockPlaceEvent.block = { "x": voxel.position.x, "y": voxel.position.y, "z": voxel.position.z, 'mat': selectIndex }
                    console.log(blockPlaceEvent.block)
                    document.dispatchEvent(blockPlaceEvent);
                }
                else { console.warn('блок заглючил и не поставился'); }
            }
        }
    }
}
