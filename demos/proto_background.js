// globals
var ctx;
var canvas;
var canvas_size = 500;
var world_vector = {x:0,y:0};
var vel = {x:0,y:0};

var bg_img = new Image();
// ---------------= =---------------
$(document).on('ready',function(){
	canvas = $("#canvas_game")[0];
	canvas.width = canvas.height = canvas_size;
	ctx = canvas.getContext("2d");

	bg_img.src = "img/bg.png";

	setInterval(draw_frame,20);

	$(canvas).on('mousemove',mouse_move);
});
// ---------------= =---------------
function draw_frame()
{
	world_vector.x += vel.x;
	world_vector.y += vel.y;

	// default background
	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,canvas_size,canvas_size);
	ctx.strokeStyle = 'black';
	ctx.strokeRect(0,0,canvas_size,canvas_size);

	var dx = parseInt(world_vector.x/canvas_size);
	var dy = parseInt(world_vector.y/canvas_size);

	ctx.save();
	ctx.translate(-world_vector.x, -world_vector.y);
	ctx.fillStyle = ctx.createPattern(bg_img,"repeat");

	// moving background (+1 and -1 blocks around) (not optimal:should be max 4 visible)
	for(var ix=-1;ix<=1;ix++)
		for(var iy=-1;iy<=1;iy++)
			ctx.fillRect((dx+ix)*canvas_size,(dy+iy)*canvas_size,canvas_size,canvas_size);

	ctx.restore();

	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle='white';
	ctx.moveTo(canvas_size/2,canvas_size/2);
	ctx.lineTo(mouse.x,mouse.y);
	ctx.stroke();

	console.log(dx+","+dy);
}
// ---------------= =---------------
var mouse = {x:0,y:0};
function mouse_move(ev)
{
	mouse = {x:ev.offsetX,y:ev.offsetY};

	vel.x = (ev.offsetX - (canvas_size/2))/10.0;
	vel.y = (ev.offsetY - (canvas_size/2))/10.0;
}
// ---------------= =---------------
// ---------------= =---------------
// ---------------= =---------------