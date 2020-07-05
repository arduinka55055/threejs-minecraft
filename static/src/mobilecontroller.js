import * as pb from "./PlaceBreak.js"
var Euler = THREE.Euler;
var velocity = new THREE.Vector3();
var vec = new THREE.Vector3();
var canJump = true;
var lastpoint = {
    'x': 0,
    'y': 0
}
var lastpointer = {
    'x': 0,
    'y': 0
}
var lastjoystick = {
    'x': 0,
    'y': 0
}
var mover = {
    'x': 0,
    'y': 0
}


function easyDebugger(args){
	var output = ""
	for(var i=0;i<args.length;i++){
		output+="<div style='color:#"+String(Math.random()).slice(2,8)+"'>"+args[i][0]+" : "+args[i][1]+"</div>";
	}
	document.getElementById('alerter').innerHTML=output;
	return output;
}




var moveForward = function ( distance ) {

		// move forward parallel to the xz-plane
		// assumes camera.up is y-up
		vec.setFromMatrixColumn( window.camera.matrix, 0 );

		vec.crossVectors( window.camera.up, vec );

        window.camera.position.addScaledVector( vec, distance );
	};

var moveRight = function ( distance ) {

		vec.setFromMatrixColumn( window.camera.matrix, 0 );

		window.camera.position.addScaledVector( vec, distance );

	};



function calcObjIntersection(objects){
    var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(0, -1, 0 ), 0, 20);
    raycaster.ray.origin.copy( camera.position );
    raycaster.ray.origin.y -= 20;
    var intersections = raycaster.intersectObjects( objects );
    return intersections.length > 0;
}


document.addEventListener('postInit', function (params) {

    document.getElementsByTagName('canvas')[0].addEventListener('touchmove', function (event) {
        var rect = event.target.getBoundingClientRect();
        for (var it = 0; it < event.changedTouches.length; it++) {
            var x = Math.round(event.changedTouches[it].pageX - rect.left);
            var y = Math.round(event.changedTouches[it].pageY - rect.top);
            if (x > window.innerWidth * 0.4) {

                var euler = new Euler(0, 0, 0, 'YXZ');
                euler.setFromQuaternion(window.camera.quaternion);
                var offsetX = x - lastpointer.x;
                var offsetY = lastpointer.y - y;
                euler.y = lastpoint.x + offsetX * -0.01;
                euler.x = lastpoint.y + offsetY * 0.01;
                euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
                camera.quaternion.setFromEuler(euler);
            } else {
                
        
                
        //document.getElementById('outerT').style.display = '';
        //event.stopPropagation();
        //event.preventDefault();
        var elemwidth=document.getElementById('outerT').width.baseVal.valueInSpecifiedUnits; 
        x = x / window.innerWidth * 100;          // -1 1
        y = y / window.innerHeight * 100;         //  0  100%
        //         point\/          coord\/
        var xo = (x-lastjoystick.x)*4+50;
        var yo = (y-lastjoystick.y)*4+50;
        if(xo>100){xo=100;}
        if(xo<0){xo=0;}
        if(yo>100){yo=100;}
        if(yo<0){yo=0;}
        mover.x=(xo-50)/50
        mover.y=(yo-50)/50//  *2/100 -> /50
        document.getElementById('innerT').setAttribute("cx", xo.toString(10) + '%');
        document.getElementById('innerT').setAttribute("cy", yo.toString(10) + '%');
            }
        }
    });

    document.getElementsByTagName('canvas')[0].addEventListener('touchstart', function (event) {
        var rect = event.target.getBoundingClientRect();
        for (var it = 0; it < event.changedTouches.length; it++) {
            var x = Math.round(event.changedTouches[it].pageX - rect.left);
            var y = Math.round(event.changedTouches[it].pageY - rect.top);

            if (x > window.innerWidth * 0.4) {
                lastpointer.x = x;
                lastpointer.y = y;

                var euler = new Euler(0, 0, 0, 'YXZ');
                euler.setFromQuaternion(window.camera.quaternion);
                lastpoint.y = euler.x + 0;
                lastpoint.x = euler.y + 0;
                console.log('start');
            } else {
                document.getElementById('outerT').style.display = 'block';
                //event.stopPropagation();
                //event.preventDefault();
                x = x / window.innerWidth * 100;
                y = y / window.innerHeight * 100;
                var elemwidth=document.getElementById('outerT').width.baseVal.valueInSpecifiedUnits; 
                var elemheight = parseInt(window.getComputedStyle(document.getElementById('outerT')).height)/window.innerHeight*100;
                var out = {
                    "l": (x - elemwidth / 2),
                    "r": (x + elemwidth / 2),
                    "t": (y - elemheight / 2),
                    "b": (y + elemheight / 2)
                }
                document.getElementById('outerT').style.left = out.l.toString(10) + '%';
                document.getElementById('outerT').style.right = out.r.toString(10) + '%';
                document.getElementById('outerT').style.top = out.t.toString(10) + '%';
                document.getElementById('outerT').style.bottom = out.b.toString(10) + '%';
                lastjoystick.x = x;
                lastjoystick.y = y;

            }
        }

    });
    document.getElementsByTagName('canvas')[0].addEventListener('touchend', function (event) {

        var rect = event.target.getBoundingClientRect();
        var flag = false;
        var flag2 = false;
        for (var it = 0; it < event.touches.length; it++) {
            var x = Math.round(event.touches[it].pageX - rect.left);
            var y = Math.round(event.touches[it].pageY - rect.top);
            if (x > window.innerWidth * 0.4) {
                flag = true;
            }
            if (x < window.innerWidth * 0.4) {
                flag2 = true;
            }
        }
        if (!flag) {
            lastpoint.y = 0;
            lastpoint.x = 0;
            console.log("end");
        }
        if(!flag2){
            document.getElementById('outerT').style.display = '';
            document.getElementById('innerT').setAttribute("cx", '50%');
            document.getElementById('innerT').setAttribute("cy", '50%');
            mover.x = 0;
            mover.y = 0;
            
        }
    });


    var selectors = document.getElementById('selector').children;
    for(let ii=0;ii<selectors.length;ii++){
        
        selectors[ii].addEventListener('touchend',function(){
            pb.select(ii);
        });
        
    }
    document.getElementById("place").addEventListener('touchend',function(){pb.checkclick(false);});
    document.getElementById("del").addEventListener('touchend',function(){pb.checkclick(true);});
    document.getElementById("jump").addEventListener('touchend',function(){
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
    });

});




document.addEventListener('animateEvent', function(params){
		var delta = params.delta;
		velocity.x -= velocity.x * 8.0 * delta;
		velocity.z -= velocity.z * 8.0 * delta;
        
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
        
		velocity.z += mover.y * 500.0 * delta;
		velocity.x += mover.x * 500.0 * delta;
		//easyDebugger([  ["x:",mover.x] , ["y:",mover.y]  ])
		if (calcObjIntersection(window.objects) == true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}		
		
		moveRight( velocity.x * delta );
		window.camera.position.y+=velocity.y * delta;
		moveForward( -velocity.z * delta );
		
		if ( window.camera.position.y < 25 ) {
			velocity.y = 0;
			camera.position.y = 25;
			canJump = true;
		}
	});
