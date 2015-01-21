// --------------------= =------------------------
var MISSILE_SIZE = 6;
var FRAME_FREQUENCY = 33; // MILLISECONDS PER FRAME

var CANVAS_SIZE = 500;
var canvas;
var ctx;
var image;
var world = {x:300,y:200,w:500,h:500};

var missile = {
	pos:{x:0.0,y:0.0},
	movementVector:{x:0.0,y:0.0}, // model with normalized vector movement and velocity
	vel: 1.0,
	accel: {x:0.3,y:0.0}
};

var imgBg = new Image();
var imgMissile = new Image();
// --------------------= =------------------------
$(document).on('ready',function(){
	canvas = $("#game_canvas")[0];
	canvas.width = canvas.height = CANVAS_SIZE;
	ctx = canvas.getContext('2d');

	$(document).mousedown(function(){createMissile();});

	imgBg.src = 'img/bg.png';
	imgMissile.src = 'img/missile.png';

	createMissile();

	setInterval(updateFrame,FRAME_FREQUENCY);
});
// --------------------= =------------------------
function updateFrame()
{
	// updates movement according to acceleration
	var vx = missile.accel.x + missile.movementVector.x * missile.vel;
	var vy = missile.accel.y + missile.movementVector.y * missile.vel;

	missile.vel = Math.sqrt(vx*vx + vy*vy);
	missile.movementVector.x = vx/missile.vel;
	missile.movementVector.y = vy/missile.vel;

	missile.pos.x += missile.movementVector.x * missile.vel; 
	missile.pos.y += missile.movementVector.y * missile.vel;

	if(missile.pos.y > CANVAS_SIZE/2){ // when missile raises to half of height, changes movement
		missile.accel.x = Math.random()*6.0 - 5.0;//  -6.0;//-Math.random() * 6.0 ;
		missile.accel.y = 1.0;
	}
	if(missile.pos.y > CANVAS_SIZE)
		createMissile();

	// draw background
	ctx.fillStyle = ctx.createPattern(imgBg,'repeat');
	ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

	// draw missile
	ctx.save();
	ctx.translate(missile.pos.x,CANVAS_SIZE-missile.pos.y);
	ctx.rotate(Math.atan(missile.movementVector.x/missile.movementVector.y)-Math.PI/2);
	ctx.drawImage(imgMissile,0,0,50,15);
	ctx.restore();
}
// --------------------= =------------------------
function createMissile()
{
	// reinitializes movement
	missile.pos.x = missile.pos.y = 0.0;

	missile.movementVector.x = 1.0;
	missile.movementVector.y = 3.0;

	var v = Math.sqrt(missile.movementVector.x*missile.movementVector.x + missile.movementVector.y*missile.movementVector.y);

	missile.movementVector.x /= v;
	missile.movementVector.y /= v;

	missile.vel = 10.0;

	missile.accel.x = 0.7;
	missile.accel.y = 0.0;
}
// --------------------= =------------------------
// --------------------= =------------------------
