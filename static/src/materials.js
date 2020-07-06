export var materials = [[
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grass.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grass.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grassTop.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grassground.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grass.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/grass.png') })
],
[
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/diamond.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/diamond.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/diamond.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/diamond.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/diamond.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/diamond.png') })
],
[
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/cobblestone.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/cobblestone.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/cobblestone.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/cobblestone.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/cobblestone.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/cobblestone.png') })
],
[
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/tree.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/tree.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/tree.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/tree.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/tree.png') }),
	new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load('/static/textures/tree.png') })
]]

materials.forEach((list) => {
	list.forEach((texturka) => { 
		texturka.map.magFilter = THREE.NearestFilter;
		texturka.map.minFilter = THREE.NearestFilter;
	})
})

//Навіщо пихати цю фігню всюди?
//Текстури живуть тут