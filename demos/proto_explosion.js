// ---------------= =---------------
var FRAME_FREQUENCY=33;
var CANVAS_WIDTH=500;
var CANVAS_HEIGHT=500;
var VERY_HIGH=4,HIGH=3,MEDIUM=2,LOW=1,VERY_LOW=0;

var canvas;
var ctx;

var imgBg = new Image();

var imgExplossions = new Image();

var explossionParticles = [];
// ---------------= =---------------
$(document).on('ready',function()
{
	canvas = $("#game_canvas")[0];
	canvas.width=CANVAS_WIDTH;
	canvas.height=CANVAS_HEIGHT;

	ctx = canvas.getContext('2d');

	$(document).on('mousemove',function(ev){
		x = ev.offsetX;
		y = CANVAS_HEIGHT - ev.offsetY;
	});

	$(document).on('mousedown',createBigExplossion);

	imgBg.src = 'img/bg.png';
	imgExplossions.src = 'img/explossions.png';

	lastTime = getTime();
	setInterval(updateFrame,FRAME_FREQUENCY);
});
// ---------------= =---------------
var newParticleCounterMillis=0;
var GENERATE_PARTICLE_THRESHOLD = 80;
var x=50.0,y=50.0, xv=3.0,yv=4.5;

var lastTime;
function updateFrame()
{
	var currentTime = getTime();
	var diff = currentTime - lastTime;
	lastTime = currentTime;

	// create particles
	newParticleCounterMillis += diff;
	if(newParticleCounterMillis >= GENERATE_PARTICLE_THRESHOLD){
		newParticleCounterMillis = 

		explossionParticles.push(createExplossionParticle(parseInt(x),parseInt(y),VERY_LOW));
	}

	// update particles
	var tmpArray = [];
	for(var i in explossionParticles){
		updateExplossionParticle(explossionParticles[i]);
		if(explossionParticles[i].alpha > 0.0)
			tmpArray.push(explossionParticles[i]);
	}

	explossionParticles = tmpArray;

	drawFrame();
}
// ---------------= =---------------
function drawFrame()
{
	ctx.fillStyle = ctx.createPattern(imgBg,'repeat');
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	ctx.save();
	ctx.translate(0,CANVAS_HEIGHT);
	ctx.scale(1.0,-1.0);
	
	for(var i in explossionParticles)
		drawExplossionParticle(explossionParticles[i]);

	ctx.restore();
}

// ---------------= =---------------
function updateExplossionParticle(ex)
{
	ex.pos.x += ex.mov.x * ex.velocity;
	ex.pos.y += ex.mov.y * ex.velocity;

	ex.angle += ex.ANGULAR_VELOCITY;

	var ALPHA_DECAY = 0.1;
	ex.alpha -= ALPHA_DECAY;
	ex.alpha = Math.max(0.0,ex.alpha);
}
// ---------------= =---------------
function drawExplossionParticle(ex)
{
	var EXPLOSSION_WIDTH=100,EXPLOSSION_HEIGHT=100;

	var oldAlpha = ctx.globalAlpha;
	ctx.globalAlpha = ex.alpha;

	ctx.save();
	ctx.translate(ex.pos.x,ex.pos.y);
	ctx.rotate(ex.angle);
	ctx.scale(ex.size/EXPLOSSION_WIDTH,ex.size/EXPLOSSION_HEIGHT);
	ctx.drawImage(imgExplossions, 
		ex.intensity * EXPLOSSION_WIDTH, ex.imageVariation * EXPLOSSION_HEIGHT,
		EXPLOSSION_WIDTH, EXPLOSSION_HEIGHT,
		-EXPLOSSION_WIDTH/2,-EXPLOSSION_HEIGHT/2,
		EXPLOSSION_WIDTH, EXPLOSSION_HEIGHT);

	ctx.restore();

	ctx.globalAlpha = oldAlpha;
}
// ---------------= =---------------
function createExplossionParticle(x,y, intensity)
{
	var e = {
		angularVelocity: parseInt(Math.random()*2)==0?0.05:-0.05,
		intensity: intensity,
		imageVariation: parseInt(Math.random()*3), // 0,1,or 2
		size: 60,
		angle:0.0,
		velocity:parseInt(Math.random()*7)+20,
		alpha:1.0,
		pos:{x:x,y:y},
		mov:{x:0.5,y:0.5}
	};

	var movAngle = Math.random()*(360 * Math.PI/180.0);
	e.mov.x = Math.cos(movAngle);
	e.mov.y = Math.sin(movAngle);

	return e;
}
// ---------------= =---------------
function createBigExplossion(ev)
{
	var x = ev.offsetX;
	var y = ev.offsetY;
	var size = 90;

	for(var i=0;i<100;i++){
		var px = normal_random(x,x+size);
		var py = CANVAS_HEIGHT - normal_random(y,y+size);

		var p = createExplossionParticle(px,py,VERY_HIGH);

		explossionParticles.push(p);
	}
}
// ---------------= =---------------
function getTime()
{
	return new Date().getTime();
}
// ---------------= =---------------
function normal_random(min,max){
	var r = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 6;

	return parseInt(r*(max-min+1)) + min;
};
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------