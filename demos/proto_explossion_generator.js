// ---------------= =---------------
var FRAME_FREQUENCY=200;
var CANVAS_WIDTH=500;
var CANVAS_HEIGHT=300;

var canvas;
var ctx;

var imgBg = new Image();
// ---------------= =---------------
$(document).on('ready',function(){
	canvas = $("#game_canvas")[0];
	canvas.width=CANVAS_WIDTH;
	canvas.height=CANVAS_HEIGHT;

	ctx = canvas.getContext('2d');

	imgBg.src = 'img/bg.png';

	setTimeout(drawFrame,FRAME_FREQUENCY);
});
// ---------------= =---------------
function drawFrame()
{
	// ctx.fillStyle= ctx.createPattern(imgBg,'repeat');
	// ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

	for(var i=0;i<5;i++){
		var colors = [
			["#DDD","#DDD","#DDD"],
			["#BBB","#BBB","#aaa"],
			["#BBB","#888","#555"],
			["#BBB","#888","yellow"],
			["#BBB","yellow","red"],
		];

		for(var k=0;k<3;k++){
			ctx.save();
			ctx.translate(50+i*100,50+k*100);
			createExplossion(colors[i][0],colors[i][1],colors[i][2]);	
			ctx.restore();
		}
	}
}
// ---------------= =---------------
function createExplossion(color1,color2,color3)
{
	var colors=[color1,color2,color3];

	var oldAlpha = ctx.globalAlpha;
	ctx.globalAlpha = 0.8;

	ctx.save();

	var SIZE = 100;

	for(var i=0;i<3;i++){
		for(var k=0;k<20;k++) {
			var x = normal_random(0,SIZE);
			var y = normal_random(0,SIZE);

			var maxRadius = Math.min(Math.min(y,100-x), Math.min(x,100-x));

			var r = Math.min(random(0,25),maxRadius);

			// r = 25 - (25 * Math.sqrt(x*x+y*y)/(100-r)) + 5;

			ctx.beginPath();
			ctx.fillStyle=colors[i];
			ctx.arc(x-50,y-50,r,0,Math.PI*2);
			ctx.fill();
		}

		ctx.scale(0.7,0.7);
	}

	ctx.restore();

	ctx.globalAlpha = oldAlpha;
}
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------
function normal_random(min,max){
	var r = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 6;

	return parseInt(r*(max-min+1)) + min;
};
// ---------------= =---------------
function random(min,max)
{
	return parseInt(Math.random()*(max-min+1)) + min;
}
// ---------------= =---------------
