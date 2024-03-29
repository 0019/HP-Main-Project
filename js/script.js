var data = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]];

// Image object and its basic function
var imgObj = new Image();
imgObj.onload = function() {
	$('#sky').attr('src', imgObj.src);
};

// Master function of switching scenes
function relocate() {
	zoomBack();
	$('#sky').attr('src', '#img' + count);
	$('#sky, #camera').attr('position','0, 0, 0');
	$('#logo').attr('position','0, -1.8, 0');
	console.log(count + " loaded");
	// Adjust scene orientation
	/*
	switch(count) {
		case 1: $('a-sky').attr('rotation', '0 -85 0'); break;
		case 2: $('a-sky').attr('rotation', '0 90 0'); break;
		case 3: $('a-sky').attr('rotation', '0 95 0'); break;
		case 4: $('a-sky').attr('rotation', '0 -73 0'); break;
		case 5: $('a-sky').attr('rotation', '0 22 0'); break;
	}
	*/
//	if (imgObj.src.indexOf('M'))
//		imgObj.src = 'img/' + count + '.jpg';
}

var count = 1;
var keylog = 2;

var isMobile = false;

var interval = 0.05;
var gap = 0.01;
var loop = interval / gap;
var transitting = 0; // 0: waiting 1: transitting 2: updating count

var element = document.getElementsByTagName('body')[0]; // document.body;

var timer = null;

function desktopControls(e) {
	var rotation = $('#camera').attr('rotation').y % 360;
	rotation = Math.abs(rotation);
	if (e.keyCode == 87 || e.deltaY < 0) {
		if (rotation <= 90 || rotation >= 270) increaseCount();
		else decreaseCount();
	} else if (e.keyCode == 83 || e.deltaY > 0) {
		if (rotation <= 90 || rotation >= 270) decreaseCount();
		else increaseCount();
	}
}

function mobileControls(e) {
	if (timer == null && (e.keyCode == 190 || e.keyCode == 65)) {
		timer = setInterval(function() {
			increaseCount();
		}, 0.2);
	} else if (timer == null && (e.keyCode == 188 || e.keyCode == 68)) {
		timer = setInterval(function() {
			decreaseCount();
		}, 0.2);
	} else if (e.keyCode == 81 || e.keyCode == 67) {
		clearInterval(timer);
		timer = null;
	}
};

$('body').on('keyup', function(e) {
	if (e.keyCode == 190 || e.keyCode == 188) {
		//loadLargeImage();
	}
});

function increaseCount() {
	if (!transitting && count < 12) {
		transitting = 2;
		count++;
		smoothRelocate('f');
	}
}

function decreaseCount() {
	if (!transitting && count > 1) {
		transitting = 2;
		count--;
		smoothRelocate('b');
	}
}
/*
$('body').on('keydown', function(e) {
	if (e.keyCode == 87 && keylog > 0) {
		console.log($('#camera').attr('position'));
	}
});
*/
// Zoom in and out
/*
$('body').on('keydown', function(e) {
	console.log(e.keyCode);
	var psn = $('#camera').attr('position');
	var rtn = $('#camera').attr('rotation');
	var va = parseFloat(rtn.x) / 180 * Math.PI; // Vertical Angle
	var ha = parseFloat(rtn.y) / 180 * Math.PI; // Horizontal Angle
	var levelLength = 35 * Math.cos(va);
	if (e.keyCode == 87 && keylog > 0) {
		$('.active').addClass('zoommode');
		$('.active').attr('opacity', 0);
		var X = -levelLength * Math.sin(ha) + psn.x;
		var Z = -levelLength * Math.cos(ha) + psn.z;
		var Y = 30 * Math.sin(va);
		console.log('ha: ' + ha + 'cos(ha): ' + Math.cos(ha));
		$('#camera').attr('position', X + ', ' + Y + ', ' + Z);
		keylog--; 
	} else if (e.keyCode == 83 && keylog < 2) {
		zoomBack();
	}
});
*/

function zoomBack() {
	keylog = 2;
	$('#camera').attr('position', '0, 0, 0');
}

// Smooth relocation
function smoothRelocate(d) {
	transitting = 1;
	var speed;
	if (d == 'f') speed = -3;
	else speed = 3;
    //var name = $(this).attr('name');
    //console.log('Jump to site ' + name);
    //count = parseInt(name);
    //console.log('Count name = ' + count);
    //var pos = $(this).attr('position');
    var cpos = $('#camera').attr('position');
    var pos = {'x': 0, 'y': 0, 'z': speed};
	var x = parseFloat(cpos.x);
    var z = parseFloat(cpos.z);
    var gx = parseFloat(pos.x) - x;
    var gz = parseFloat(pos.z) - z;
    var dx = gx / loop;
    var dz = gz / loop;
    var counter = 0;
    var newPos, logoPos;
    var moveCam = setInterval(function() {
        x += dx;
        z += dz;
        counter++;
        newPos = x + ' ' + 0 + ' ' + z;
        logoPos = x + ' ' + '-1.8' + ' ' + z;
        $('#camera').attr('position', newPos);
        $('#logo').attr('position', logoPos);
        if (counter >= loop) {
            clearInterval(moveCam);
            relocate();
			transitting = 0;
        }
    }, gap * 1000);
};

function start() {
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//	isMobile = true;
	if (isMobile) {
		document.addEventListener('keydown', mobileControls, false);
		$('#camera').html('<a-entity camera look-controls mouse-cursor></a-entity>');
	} else {
		$('#camera').html('<a-entity camera mouse-cursor></a-entity>');
		document.addEventListener('wheel', desktopControls, false);
		document.addEventListener('keydown', desktopControls, false);
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.addEventListener('click', function() {
			element.requestPointerLock();
		}, false);
		document.addEventListener('pointerlockchange', lockChangeHandler, false);
		document.addEventListener('mozpointerlockchange', lockChangeHandler, false);
	}
	relocate();
}

function loadLargeImage() {
	if (!transitting) {
		imgObj.src = 'img/' + count + '.jpg';
	}
}

function canvasLoop(event) {
	var rotation = $('#camera').attr('rotation');
	var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
	var y = parseFloat(rotation.y) - movementX * 0.12;
	var x = parseFloat(rotation.x) - movementY * 0.12;
	x = Math.max( -90, Math.min(90, x) );
	$('#camera').attr('rotation', x + ' ' + y + ' ' + rotation.z);
}

function lockChangeHandler() {
	if(document.pointerLockElement === element || document.mozPointerLockElement === element) {
		document.addEventListener("mousemove", canvasLoop, false);
	} else {
		document.removeEventListener("mousemove", canvasLoop, false);
	}
}

start();
