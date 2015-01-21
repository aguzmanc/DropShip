// --------------------= =------------------------
var canvas,ctx;
var CANVAS_SIZE=1000;

var terrain=[];
var terrain

var wheel={x:130,y:0,r:20};
// --------------------= =------------------------
$(document).on('ready',function(){
	canvas = $("#game_canvas")[0];
	canvas.width=canvas.height=CANVAS_SIZE;
	ctx = canvas.getContext('2d');

	$(document).mousedown(function(){wheel.x=0;});

	// create random terrain 
	var h = 0;
	for(var i=0;i<CANVAS_SIZE;i++){
		h += parseInt(Math.random()*2)==0 ? 2:-2;

		h = Math.max(0,h);

		terrain.push(h);
	}

	setInterval(updateFrame,33);
});
// --------------------= =------------------------
function updateFrame()
{
	wheel.x+=5;

	// points closest to circle
	var terrainModified = terrain.slice(0);

	var max = -99999;
	// check all points in 'x' which are related to the circle
	for(var x=-wheel.r;x<=wheel.r;x++){
		if(wheel.x+x<0 || wheel.x+x>=CANVAS_SIZE) continue; // when part of circle is outside bounds

		// calculate 'cos' for point corresponding to 'x' in circle
		var cos = Math.abs(Math.sqrt(wheel.r*wheel.r - x*x)/wheel.r);

		// calculates 'sin' --> (1-cos)
		// to produce height in that point of circle
		var h = wheel.r * (1.0 - cos);

		// intersection point of circle with terrain, and save maximum
		if(terrain[wheel.x+x]-h > max)
			max = terrain[wheel.x+x]-h;

		terrainModified[wheel.x+x] = terrainModified[wheel.x+x]-h;
	}

	// updates offset in y to draw circle
	wheel.y = max;

	// draw background
	ctx.fillStyle='white';
	ctx.fillRect(0,0,CANVAS_SIZE,CANVAS_SIZE);

	// draw terrain
	ctx.moveTo(0,CANVAS_SIZE/2);

	ctx.beginPath();
	ctx.strokeStyle='black';
	for(var i=0;i<CANVAS_SIZE;i++)
		ctx.lineTo(i,CANVAS_SIZE/2-terrain[i]);
	ctx.stroke();

	// draw modified terrain
	// ctx.moveTo(0,CANVAS_SIZE/2);

	// ctx.beginPath();
	// ctx.strokeStyle='red';
	// for(var i=0;i<CANVAS_SIZE;i++)
	// 	ctx.lineTo(i,CANVAS_SIZE/2-terrainModified[i]);
	// ctx.stroke();		

	// draw floor horizontal line
	ctx.beginPath();
	ctx.strokeStyle='gray';
	ctx.moveTo(0,CANVAS_SIZE/2);
	ctx.lineTo(CANVAS_SIZE,CANVAS_SIZE/2);

	ctx.stroke();

	// draw wheel
	ctx.beginPath();
	ctx.strokeStyle='blue';
	ctx.arc(wheel.x,CANVAS_SIZE/2-wheel.y-wheel.r,wheel.r,0,Math.PI*2);
	ctx.stroke();
}
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------
// --------------------= =------------------------