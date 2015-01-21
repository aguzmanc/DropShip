var FPS = 30;
var FRAME_FREQUENCY = parseInt(1000/FPS);
var MILLIS_LOST_THRESHOLD = 100;

var canvas_size = 500;

var ctx;
var canvas;

var vel = 1.5; // pixels per millisecond

var bullets = [];

var img_bullet, img_bg;

var target={x:0,y:0};
var machine_gun={x:0,y:0};
var shot = false;

var keys={up:false,down:false,left:false,right:false};
// ---------------------= =---------------------
$(document).on('ready',function()
{
	canvas = $("#game_canvas")[0];
	canvas.width = canvas.height = canvas_size;

	$(canvas).on('mousemove',mouse_move);
	$(canvas).mousedown(function(){shot=true;});
	$(canvas).mouseup(function(){shot=false;});
	$(document).on('keydown',keydown);
	$(document).on('keyup',keyup);

	ctx = canvas.getContext("2d");

	img_bullet = new Image();
	img_bullet.src = 'img/shot.png';

	img_bg = new Image();
	img_bg.src = 'img/bg.png';

	last_time = get_time();
	update_cycle();

});
// ---------------------= =---------------------
var last_time;
var accumulative_ms = 0;
var ACCUMULATIVE_MS_THRESHOLD = 100;

function update_cycle()
{
	var current_time = get_time();
	var diff = current_time - last_time;
	last_time = current_time;

	// update all bullets
	var include_idxs=[];

	for(var i in bullets){
		var bullet = bullets[i];

		var velx = vel * bullet.vector.x;
		var vely = vel * bullet.vector.y;

		bullet.pos.x += velx * diff;
		bullet.pos.y += vely * diff;	

		// bullets out of range must disappear, so, their indexes are saved in an array
		if( (bullet.pos.x*bullet.pos.x + bullet.pos.y+bullet.pos.y) < (2*canvas_size*canvas_size))
			include_idxs.push(i)
	}

	// remove all elements out of range (only these ones in the saved index array)
	var new_bullets = []; // array in which 'in range' bullets are stored
	for(var k in include_idxs){
		var idx = include_idxs[k];
		new_bullets.push(bullets[idx]);
	}

	bullets = new_bullets; // only 'in range' bullets remain

	accumulative_ms += diff;

	// create a new bullet every ammount of time
	if(accumulative_ms > ACCUMULATIVE_MS_THRESHOLD && shot){
		accumulative_ms = 0;
		bullets.push(create_bullet(machine_gun,target));
	}

	// update machine gun position
	if(keys.right) machine_gun.x+=5;
	if(keys.left) machine_gun.x-=5;;
	if(keys.up) machine_gun.y-=5;
	if(keys.down) machine_gun.y+=5;

	machine_gun.x = Math.max(0,Math.min(canvas_size,machine_gun.x));
	machine_gun.y = Math.max(0,Math.min(canvas_size,machine_gun.y));

	draw_frame();

	setTimeout(update_cycle, FRAME_FREQUENCY);	
}
// ---------------------= =---------------------
function draw_frame()
{
	ctx.fillStyle = ctx.createPattern(img_bg,'repeat');
	ctx.fillRect(0,0,canvas_size,canvas_size);

	draw_bullets();
	draw_target();
	draw_machine_gun();
}
// ---------------------= =---------------------
function draw_machine_gun()
{
	ctx.fillStyle = 'white';
	ctx.fillRect(machine_gun.x-2,machine_gun.y-2,4,4);
}
// ---------------------= =---------------------
function draw_target()
{
	ctx.beginPath();
	ctx.fillStyle = shot?'red':'white';
	ctx.arc(target.x,target.y,5,0,2*Math.PI);
	ctx.fill(); 

	ctx.beginPath();
	ctx.strokeStyle = shot?'red':'white';
	ctx.arc(target.x,target.y,15,0,2*Math.PI,false);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillRect(target.x-20,target.y,40,2);
	ctx.fillRect(target.x,target.y-20,2,40);
}
// ---------------------= =---------------------
function draw_bullets(){
	for(var i in bullets){
		var bullet = bullets[i];

		ctx.save();
		ctx.translate(parseInt(bullet.pos.x),parseInt(bullet.pos.y));
		ctx.rotate(bullet.vector.x==0?(3.141592/2.0):Math.atan(bullet.vector.y/bullet.vector.x));
		ctx.drawImage(img_bullet,-img_bullet.width/2,-img_bullet.height/2);
		ctx.restore();
	}
}
// ---------------------= =---------------------
function create_bullet(from,to)
//(init_x, init_y, vector_x, vector_y)
{
	var random_angle = (Math.random()-0.5) * 20 * (3.1415/180.0); // angle between -5 and 5

	var vx = to.x-from.x;
	var vy = to.y-from.y;

	vx = vx * Math.cos(random_angle) - vy * Math.sin(random_angle);
	vy = vx * Math.sin(random_angle) + vy * Math.cos(random_angle);

	// normalize movement vector
	var module = Math.sqrt(vx*vx + vy*vy);

	var bullet = {
		pos:{x:from.x,y:from.y},
		vector:{x:vx/module,y:vy/module}
	};

	return bullet;
}
// ---------------------= =---------------------
function get_time()
{
	return new Date().getTime();
}
// ---------------------= =---------------------
function mouse_move(ev)
{
	target.x = ev.offsetX;
	target.y = ev.offsetY;
}
// ---------------------= =---------------------
var trans={40:'down',38:'up',37:'left',39:'right'};
function keydown(ev)
{
	keys[trans[ev.which]]=true;
}
// ---------------------= =---------------------
function keyup(ev)
{
	keys[trans[ev.which]]=false;
}
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------