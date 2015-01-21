// --------------------= =------------------------
var CANVAS_WIDTH=1000;
var CANVAS_HEIGHT=500;
var FRAME_FREQUENCY = 33; // in ms

var canvas;
var ctx;

var imgBg=new Image();
var terrain=[];

var car={
	WIDTH : 100,
	WHEEL_RADIUS : 30,
	VEL: 5.0,
	VEL_CANNON: Math.PI/100,

	imgWheel:new Image(),
	imgBody: new Image(),
	imgAxis: new Image(),
	imgCannon: new Image(),

	pos:{x:0,y:0},
	frontWheelY:0.0,
	backWheelY:0.0,
	cannonAngle: 0,

	update: function(){
		if(keys.right)
			this.pos.x += this.VEL;
		else if(keys.left)
			this.pos.x -= this.VEL;

		if(keys.up)
			this.cannonAngle += this.VEL_CANNON;
		else if(keys.down)
			this.cannonAngle -= this.VEL_CANNON;

		// max and min angle constraints
		this.cannonAngle = Math.max(-Math.PI/16,Math.min(Math.PI/2 - Math.PI/16,this.cannonAngle));

		this.frontWheelY = this.calculateWheelElevation(this.pos.x+this.WIDTH/2);
		this.backWheelY = this.calculateWheelElevation(this.pos.x-this.WIDTH/2);

		this.pos.y = (this.frontWheelY+this.backWheelY)/2;
	},

	draw: function(){
		var r = this.WHEEL_RADIUS;

		// body
		var BODY_WIDTH=200,BODY_HEIGHT=65;
		var AXIS_WIDTH=50, AXIS_HEIGHT=35;
		var CANNON_WIDTH=200, CANNON_HEIGHT=30;

		var dx = (this.pos.x+this.WIDTH/2) - (this.pos.x-this.WIDTH/2);
		var dy = this.frontWheelY - this.backWheelY;

		ctx.save();

		// ADJUST COORDINATE SYSTEM
		ctx.scale(1.0,-1.0);
		ctx.translate(0,-CANVAS_HEIGHT);

		// horizontal movement
		ctx.translate(this.pos.x,0);

		var dx = (this.pos.x+this.WIDTH/2) - (this.pos.x-this.WIDTH/2);
		var dy = this.frontWheelY - this.backWheelY;
		
		// BODY
		ctx.save();
		ctx.translate(10,this.pos.y + 70); // PLUS BODY ELEVATION
		ctx.rotate(Math.atan2(dy,dx));

		// CANNON
		ctx.save();
		ctx.translate(0,40);
		ctx.rotate(this.cannonAngle);
		ctx.translate(50,0);
		ctx.scale(1.0,-1.0); // just for the images

		ctx.drawImage(this.imgCannon,-CANNON_WIDTH/2,-CANNON_HEIGHT/2,CANNON_WIDTH,CANNON_HEIGHT);
		ctx.restore();// cannon

		// CANNON AXIS
		ctx.save();
		ctx.translate(0,40);
		ctx.scale(1.0,-1.0); // just for the image
		ctx.drawImage(this.imgAxis,-AXIS_WIDTH/2,-AXIS_HEIGHT/2,AXIS_WIDTH,AXIS_HEIGHT);
		ctx.restore();

		// draw body
		ctx.scale(1.0,-1.0); // just for the images
		ctx.drawImage(this.imgBody,-BODY_WIDTH/2,-BODY_HEIGHT/2,BODY_WIDTH,BODY_HEIGHT);

		ctx.restore(); // body

		// wheels
		ctx.translate(0,r);

		// FRONT WHEEL
		ctx.save();
		ctx.translate(this.WIDTH/2,this.frontWheelY);
		ctx.rotate(-this.pos.x/50);
		ctx.drawImage(this.imgWheel,-r,-r,r*2,r*2);
		ctx.restore();

		// BACK WHEEL
		ctx.save();
		ctx.translate(-this.WIDTH/2,this.backWheelY);
		ctx.rotate(-this.pos.x/50);
		ctx.drawImage(this.imgWheel,-r,-r,r*2,r*2);
		ctx.restore();

		ctx.restore();
	}, 

	calculateWheelElevation:function(wheelX){
		var r = this.WHEEL_RADIUS;
		var max = -99999;

		for(var x=-r;x<=r;x++){
			if(wheelX+x < 0 || wheelX+x > CANVAS_WIDTH) continue

			var h = r - Math.sqrt(r*r - x*x);

			max = Math.max(max,terrain[wheelX+x]-h);
		}

		return max;
	}
};
// --------------------= =------------------------
var keys={up:false,down:false,right:false,left:false};

$(document).on('ready',function(){
	canvas = $("#game_canvas")[0];
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	ctx = canvas.getContext('2d');

	imgBg.src='img/bg_inv.png';
	car.imgWheel.src='img/wheel.png';
	car.imgBody.src='img/body.png';
	car.imgAxis.src='img/axis.png';
	car.imgCannon.src='img/canon.png';

	$(document).on('keydown',function(ev){
		switch(ev.which){
			case 65:keys.left=true;break;
			case 68:keys.right=true;break;
			case 87:keys.up=true;break;
			case 83:keys.down=true;break;
		};
	});

	$(document).on('keyup',function(ev){
		switch(ev.which){
			case 65:keys.left=false;break;
			case 68:keys.right=false;break;
			case 87:keys.up=false;break;
			case 83:keys.down=false;break;
		};
	});

	generateTerrain();

	setInterval(updateFrame,FRAME_FREQUENCY);
});
// --------------------= =------------------------
function updateFrame()
{
	car.update();

	// draw background
	ctx.fillStyle=ctx.createPattern(imgBg,'repeat');
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	car.draw();

	// draw terrain
	ctx.beginPath();
	ctx.strokeStyle='red';
	ctx.lineWidth=1;

	ctx.moveTo(0,CANVAS_HEIGHT);
	for(var i=0;i<CANVAS_WIDTH;i++)
		ctx.lineTo(i,CANVAS_HEIGHT - terrain[i]);
	ctx.stroke();

}
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
function generateTerrain()
{
	terrain = [];

	var h = 0;
	for(var i=0;i<CANVAS_WIDTH;i++){
		h += parseInt(Math.random()*2)==0 ? 2:-2;
		terrain.push(Math.abs(h));
	}
}
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------