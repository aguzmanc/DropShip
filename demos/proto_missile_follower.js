// --------------------= =--------------------
var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var FRAME_FREQUENCY = 33; // milliseconds every frame
// --------------------= =--------------------
var canvas;
var ctx;

var imgBg = new Image();

var missile = {
	WIDTH: 60,
	HEIGHT: 20,
	AIM_ANGLE_THRESHOLD: (Math.PI/180.0) * 5.0,
	FIXED_ANGULAR_VEL: Math.PI/40.0,
	VELOCITY: 20.0,

	img: new Image(),
	angularVel:0.0,
	pos:{x:100,y:200},
	mov:{x:0.5,y:0.5},

	getBoundingBox : function(){
		var dx = Math.abs((this.WIDTH/2) * this.mov.x); // mov.x = cos(alpha)
		// also uses WIDTH (which is the width of missile always pointing horizontal or vertical)
		var dy = Math.abs((this.WIDTH/2) * this.mov.y); // mov.y = sin(alpha) 

		return {
			x: this.pos.x-dx,
			y: this.pos.y-dy,
			w: dx*2,
			h: dy*2
		};
	},

	getMarginInfo: function(){
		var bb = this.getBoundingBox();

		var res={
			distance: 0.0,
			pos:{x:0,y:0},
			hor:0,  // -1,0 or 1
			ver:0	// -1,0 or 1
		};

		// calculates margin positions
		res.pos.x = Math.max(0,Math.min(this.pos.x,CANVAS_WIDTH));
		res.pos.y = Math.max(0,Math.min(this.pos.y,CANVAS_HEIGHT));

		var dx=0.0,dy=0.0;

		// horizontal info
		if(bb.x+bb.w < 0){
			res.hor=-1,
			dx=Math.abs(bb.x+bb.w)
		}else if(bb.x > CANVAS_WIDTH){
			res.hor=1,
			dx=bb.x-CANVAS_WIDTH
		}else 
			res.hor=0;

		// vertical info
		if(bb.y+bb.h < 0){
			res.ver = -1;
			dy=Math.abs(bb.y+bb.h);
		}else if(bb.y > CANVAS_HEIGHT){
			res.ver = 1;
			dy=bb.y-CANVAS_HEIGHT
		} else 
			res.ver=0;

		res.distance = parseInt(Math.sqrt(dx*dx+dy*dy));

		return res;
	}
};

var target={x:0,y:0};

// timming variables
// var lastTime = 0;
// --------------------= =--------------------
$(document).on('ready',function(){
	canvas = $("#game_canvas")[0];
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	ctx = canvas.getContext("2d");

	// mouse movements updates target
	$(canvas).mousemove(function(ev){
		target.x=ev.offsetX;
		target.y=CANVAS_HEIGHT - ev.offsetY;
	});

	missile.img.src = 'img/missile.png';
	missile.img.width=10;
	imgBg.src = 'img/bg.png';

	lastTime = getTime();
	setInterval(updateFrame,FRAME_FREQUENCY);
});
// --------------------= =--------------------
function updateFrame()
{
	// var currentTime = getTime();
	// var diff = currentTime - lastTime;
	// lastTime = currentTime;

	// update missile
	var t = {
		x:target.x-missile.pos.x,
		y:target.y-missile.pos.y
	};

	// determines if rotates left or right to reach target
	var angDiff = Math.atan2(t.y,t.x) - Math.atan2(missile.mov.y,missile.mov.x);

	// only changes angle when difference between angles is substantial
	if(Math.abs(angDiff) > missile.AIM_ANGLE_THRESHOLD){
		if(angDiff<-Math.PI) angDiff+=Math.PI*2; // angle fix correction

		angularVel = ((angDiff > 0) ? 1.0:-1.0) * missile.FIXED_ANGULAR_VEL;

		// // updates movement angle (using vector angle)
		var newAngle = Math.atan2(missile.mov.y,missile.mov.x) + angularVel;
		missile.mov.x = Math.cos(newAngle);
		missile.mov.y = Math.sin(newAngle);
	}

	// // updates position with new movement angle and velocity
	missile.pos.x += missile.mov.x * missile.VELOCITY;
	missile.pos.y += missile.mov.y * missile.VELOCITY;

	// ------= DRAWING =--------
	// draw background
	ctx.fillStyle = ctx.createPattern(imgBg,'repeat');
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	// draw missile
	ctx.save();
	ctx.translate(missile.pos.x,CANVAS_HEIGHT - missile.pos.y);
	ctx.rotate(-Math.atan2(missile.mov.y,missile.mov.x));
	ctx.drawImage(missile.img,-missile.WIDTH/2,-missile.HEIGHT/2,missile.WIDTH,missile.HEIGHT);
	ctx.restore();

	// draw margin info
	var info = missile.getMarginInfo();

	if(!(info.hor==0 && info.ver==0)){
		var rot = 0.0;

		var let = ['a','b','c'];
		var cod = let[info.hor+1] + let[info.ver+1];
		var SQ = Math.PI/4.0; // 45 degrees
		// defines offset angle for the arrow of margin info
		// when zero degrees , is an arrow pointing to left 
		//  <|
		var angles={
			aa: SQ,
			ab: 0,
			ac: -SQ,
			ba: 2*SQ,
			bb: 0, // not applicable
			bc: -2*SQ,
			ca: 3*SQ,
			cb: 4*SQ,
			cc: -3*SQ
		}

		// distance for color mapping
		var MAX_DIST = 200;
		var distFactor = parseInt((  Math.min(MAX_DIST,info.distance) /MAX_DIST)*255.0);

		ctx.save();
		ctx.fillStyle = "#" + ("00"+(255-distFactor).toString(16)).substr(-2) + ("00"+distFactor.toString(16)).substr(-2) + "00";
		ctx.translate(info.pos.x,info.pos.y);
		ctx.rotate(angles[cod]);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(20,-10);
		ctx.lineTo(20,10);
		ctx.lineTo(0,0);
		ctx.fill();
		ctx.restore();

		var x = Math.max(30,Math.min(CANVAS_WIDTH-70,missile.pos.x));
		var y = Math.max(30,Math.min(CANVAS_HEIGHT-30,missile.pos.y));

		ctx.save();

		ctx.fillStyle='white';
		ctx.font="20px Georgia";
		ctx.fillText(("000"+info.distance.toString(10)).substr(-3),x,y);
		
		ctx.restore();
	}
}
// --------------------= =--------------------
/* GETS CURRENT TIME IN MILLISECONDS */
function getTime(){return (new Date()).getTime();}
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------