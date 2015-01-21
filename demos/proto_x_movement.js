// globals
var canvas_width = 500;
var canvas_height = 500;
var ctx;

var accel = 0.25;
var default_accel = 0.05;
var vel = 0;
var MAX_VEL = 2.0;
var VEL_THRESHOLD = 0.06;

var ship = {x:100,y:100,img:null};
var ship_size = 100;
var movs = {up:false,down:false,right:false,left:false};

// -----------------= =-----------------
$(document).on('ready',function(){
	var canvas = $("#game_canvas")[0];
	canvas.width = canvas_width;
	canvas.height = canvas_height;

	ctx = canvas.getContext("2d");

	ship.img = new Image();
	ship.img.src = 'img/ship.png';

	setInterval(draw_frame,20);
});
// -----------------= =-----------------
function draw_frame()
{
	var a = 0
	if(movs.right)
		a = accel
	else if(movs.left)
		a = -accel;
	else{ // no interaction
		if(vel>0) a = -default_accel;
		else a = default_accel;
	}

	vel += a;
	vel = Math.min(MAX_VEL, Math.max(-MAX_VEL,vel));

	if(Math.abs(vel)< VEL_THRESHOLD) vel=0;

	ship.x += vel;

	// draw 
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvas_width,canvas_height);
	ctx.strokeStyle = 'black';
	ctx.strokeRect(0,0,canvas_width,canvas_height);

	ctx.save();
	ctx.translate(ship.x,ship.y);
	ctx.rotate(vel/4);
	ctx.drawImage(ship.img,-ship_size/2,-ship_size/2,ship_size,ship_size);
	ctx.restore();
}
// -----------------= =-----------------
$(document).on('keydown',function(e){
	var key = e.which;

	switch(key){
		case 37: // left
			movs.left = true;
			break;
		case 39: // right
			movs.right = true;
			break;
		case 40: // down
			movs.down = true;
			break;
		case 38: // up
			movs.up = true;
			break;
	}
});
// -----------------= =-----------------
$(document).on('keyup',function(e){
	var key = e.which;

	switch(key){
		case 37: // left
			movs.left = false;
			break;
		case 39: // right
			movs.right = false;
			break;
		case 40: // down
			movs.down = false;
			break;
		case 38: // up
			movs.up = false;
			break;
	}
});
// -----------------= =-----------------
// -----------------= =-----------------