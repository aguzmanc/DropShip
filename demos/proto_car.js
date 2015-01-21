// --------------------= =--------------------
var CANVAS_SIZE = 500;
var canvas;
var ctx;
var terrain;

var car = {
	vel:10,
	frontWheel:{x:0,y:0,r:20},
	backWheel:{x:0,y:0,r:20}
};

var wheels;

var imgBg = new Image();
var imgBullet = new Image();

var target={x:10,y:10};
var machineGun={x:0,y:0};
var shotting = false;

var keys={left:false,right:false};
// --------------------= =--------------------
$(document).on('ready',function()
{
	canvas = $("#game_canvas")[0];
	canvas.width = canvas.height = CANVAS_SIZE;
	ctx = canvas.getContext("2d");

	$(canvas).mousedown(function(){shotting=true;});
	$(canvas).mouseup(function(){shotting=false;});
	$(canvas).mousemove(function(ev){
		target.x = ev.offsetX;
		target.y = CANVAS_SIZE - ev.offsetY;	
	});

	$(document).keydown(function(ev){
		if(ev.which==37) keys.left=true;
		if(ev.which==39) keys.right=true;
	});

	$(document).keyup(function(ev){
		if(ev.which==37) keys.left=false;
		if(ev.which==39) keys.right=false;
	});

	imgBg.src="img/bg.png";
	imgBullet.src='img/shot.png';

	terrain = generateTerrain();
	car = createCar(3,100,50,10,10);

	lastTime = get_time();
	setInterval(updateFrame,33);
});
// --------------------= =--------------------
function updateFrame()
{
	updateCar(car);
	updateBullets();

	drawBackground();
	drawBullets();
	drawCar(car);	
	drawTerrain(terrain);
}
// --------------------= =--------------------
var lastTime;
var accumulativeMs = 0;
var ACCUMULATIVE_MS_THRESHOLD = 100;
var velBullet = 1.5; // pixels per millisecond
var bullets = [];

function updateBullets()
{
	var current_time = get_time();
	var diff = current_time - lastTime;
	lastTime = current_time;

	// update all bullets
	var include_idxs=[];

	for(var i in bullets){
		var bullet = bullets[i];

		var velx = velBullet * bullet.vector.x;
		var vely = velBullet * bullet.vector.y;

		bullet.pos.x += velx * diff;
		bullet.pos.y += vely * diff;	

		// bullets out of range must disappear, so, their indexes are saved in an array
		if( (bullet.pos.x*bullet.pos.x + bullet.pos.y+bullet.pos.y) < (2*CANVAS_SIZE*CANVAS_SIZE))
			include_idxs.push(i)
	}

	// remove all elements out of range (only these ones in the saved index array)
	var new_bullets = []; // array in which 'in range' bullets are stored
	for(var k in include_idxs){
		var idx = include_idxs[k];
		new_bullets.push(bullets[idx]);
	}

	bullets = new_bullets; // only 'in range' bullets remain

	accumulativeMs += diff;

	// create a new bullet every ammount of time
	// console.log(accumulativeMs);
	if(accumulativeMs > ACCUMULATIVE_MS_THRESHOLD && shotting){
		accumulativeMs = 0;
		bullets.push(createBullet(getMachineGunPos(car),target));
	}
}
// --------------------= =--------------------
function drawBullets()
{
	for(var i in bullets){
		var bullet = bullets[i];

		ctx.save();
		ctx.translate(parseInt(bullet.pos.x),CANVAS_SIZE - parseInt(bullet.pos.y));
		ctx.rotate(-Math.atan2(bullet.vector.y,bullet.vector.x));
		ctx.drawImage(imgBullet,-imgBullet.width/2,-imgBullet.height/2);
		ctx.restore();
	}
}
// --------------------= =--------------------
// --------------------= =--------------------
function generateTerrain()
{
	var terrain = [];
	// create random terrain 
	var h = 0;
	for(var i=0;i<CANVAS_SIZE;i++){
		h += parseInt(Math.random()*2)==0 ? 2:-2;

		h = Math.max(0,h);

		terrain.push(h);
	}

	return terrain;
}
// --------------------= =--------------------
function createBullet(from,to)
{
	var random_angle = (Math.random()-0.5) * 20 * (Math.PI/180.0); // angle between -5 and 5

	var vx = to.x - from.x;
	var vy = to.y - from.y;

	vx = vx * Math.cos(random_angle) - vy * Math.sin(random_angle);
	vy = vx * Math.sin(random_angle) + vy * Math.cos(random_angle);

	// normalize movement vector
	var module = Math.sqrt(vx*vx + vy*vy);

	var bullet = {
		pos:{x:from.x, y:from.y},
		vector:{x:vx/module, y:vy/module}
	};

	return bullet;
}
// --------------------= =--------------------
function updateCar(car)
{
	if(keys.left){
		car.frontWheel.x -= car.vel;
		car.backWheel.x -= car.vel;		
	}

	if(keys.right){
		car.frontWheel.x += car.vel;
		car.backWheel.x += car.vel;
	}

	car.frontWheel.y = getWheelElevation(car.frontWheel,terrain);
	car.backWheel.y = getWheelElevation(car.backWheel,terrain);
}
// --------------------= =--------------------
function createCar(vel,x,width,frontRadio,backRadio)
{
	var car = {
		vel:vel,
		gunElevation:10,
		frontWheel:{x:x+width/2,y:0,r:frontRadio},
		backWheel:{x:x-width/2,y:0,r:backRadio}
	};

	return car;
}
// --------------------= =--------------------
function getWheelElevation(wheel,terrain)
{
	var max = -99999;
	// check all points in 'x' which are related to the circle
	for(var x=-wheel.r;x<=wheel.r;x++){
		if(wheel.x+x<0 || wheel.x+x>=terrain.length) continue; // when part of circle is outside bounds

		// calculate 'cos' for point corresponding to 'x' in circle
		var cos = Math.abs(Math.sqrt(wheel.r*wheel.r - x*x)/wheel.r);

		// calculates 'sin' --> (1-cos)
		// to produce height in that point of circle
		var h = wheel.r * (1.0 - cos);

		// intersection point of circle with terrain, and save maximum
		if(terrain[wheel.x+x]-h > max)
			max = terrain[wheel.x+x]-h;
	}

	return max;
}
// --------------------= =--------------------
function drawBackground()
{
	ctx.fillStyle = ctx.createPattern(imgBg,'repeat');
	ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);
}
// --------------------= =--------------------
function drawTerrain(terrain)
{
	// draw terrain
	ctx.moveTo(0,CANVAS_SIZE);

	ctx.lineWidth=1;
	ctx.beginPath();
	ctx.strokeStyle='red';
	for(var i=0;i<CANVAS_SIZE;i++)
		ctx.lineTo(i,CANVAS_SIZE-terrain[i]);
	ctx.stroke();
}
// --------------------= =--------------------
function drawCar(car)
{
	drawWheel(car.frontWheel);
	drawWheel(car.backWheel);

	var dx = car.frontWheel.x - car.backWheel.x;
	var dy = car.frontWheel.y - car.backWheel.y;

	var x = (car.frontWheel.x+car.backWheel.x)/2;
	var y = (car.frontWheel.y+car.backWheel.y)/2;

	// body
	ctx.save();
	ctx.translate(x,CANVAS_SIZE-y-30);
	ctx.rotate(-Math.atan2(dy,dx));
	ctx.fillStyle = 'white';
	ctx.fillRect(-dx/2,-5,dx,10);
	ctx.fillRect(-dx/4,-dx/2,dx/2,dx/2);

	// gun
	ctx.save();
	ctx.translate(0,-car.gunElevation);
	var gunRotation = calculateGunRotation(car);
	ctx.rotate(-gunRotation);
	ctx.fillStyle = 'red';
	ctx.fillRect(0,-6,20,12);
	ctx.fillRect(0,-3,30,6);
	ctx.restore();

	// axis gun
	ctx.beginPath();
	ctx.fillStyle = '#CF6767';
	ctx.arc(0,-10,10,0,Math.PI*2);
	ctx.fill();
	
	ctx.restore();
}
// --------------------= =--------------------
function getMachineGunPos(car)
{
	var dx = car.frontWheel.x - car.backWheel.x;
	var dy = car.frontWheel.y - car.backWheel.y;

	var x = (car.frontWheel.x+car.backWheel.x)/2;
	var y = (car.frontWheel.y+car.backWheel.y)/2;

	var angle = Math.atan2(dy,dx);
	var px = car.gunElevation * Math.cos(angle+Math.PI/2) + x;
	var py = car.gunElevation * Math.sin(angle+Math.PI/2) + y+35;

	return {x:px,y:py};
}
// --------------------= =--------------------
function drawWheel(wheel)
{
	// draw wheel
	ctx.beginPath();
	ctx.strokeStyle='white';
	ctx.lineWidth=3;
	ctx.arc(wheel.x,CANVAS_SIZE-wheel.y-wheel.r,wheel.r,0,Math.PI*2);
	ctx.stroke();	
}
// --------------------= =--------------------
function calculateGunRotation(car)
{
	var B = {
		x:(car.frontWheel.x+car.backWheel.x)/2,
		y:(car.frontWheel.y+car.backWheel.y)/2 
	};

	var beta = Math.atan2(car.frontWheel.y - car.backWheel.y,car.frontWheel.x - car.backWheel.x);
	var h = car.gunElevation + 30;

	var M = {
		x: target.x,
		y: target.y
	};

	var A = {
		x: h*Math.cos(beta)+B.x,
		y: h*Math.sin(beta)+B.y
	};

	var v1 = {x:Math.cos(beta),y:Math.sin(beta)};
	var v2 = {x: M.x-A.x, y:M.y-A.y};

	var alpha = Math.atan2(v2.y,v2.x) - Math.atan2(v1.y,v1.x);

	return alpha;
}
// --------------------= =--------------------
function get_time()
{
	return new Date().getTime();
}
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------