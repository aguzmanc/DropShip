// ---------------------= =---------------------
var mouse={left:false,right:false};
var mousePos={x:0.0,y:0.0};
var movements = {up:false,down:false,right:false,left:false};

var engine = null;



$(document).on('ready',function()
{
	// loading images before using them
	// T.O.D.O: Replace with appropiade "loading.." splash screen
	var img = (new Image()).src='img/dummy.png';
	img = (new Image()).src = 'img/bg.png';
	img = (new Image()).src = 'img/explossions.png';
	img = (new Image()).src = 'img/missile_hit.png';
	img = (new Image()).src = 'img/dropship.png';
	img = (new Image()).src = 'img/machine_gun.png';

	setTimeout(start,1000);

	
});
// ---------------------= =---------------------
var dropship;
var target;
function start()
{
	dropShip = new DropShip();
	dropShip.setMovementsObject(movements);

	target = new Transformable(0,0);
	target.scale=0.3;
	target.angularVelocity=5;

	var missile = new Missile(200,200,dropShip);
	missile.setDirection(1,1);

	engine = getEngine();
	engine.initialize('game_canvas');

	engine.background = new BasicBackground();
	engine.addElement(dropShip);

	engine.start();

	setInterval(spawnMissile,2000);

	$(document).on('mousedown',function(ev){engine.mouseDown(ev);});
	$(document).on('mouseup',function(ev){engine.mouseUp(ev);});
	$(document).on('mousemove',function(ev){engine.mouseMove(ev);});

	$(document).on('keydown', keyDown);
	$(document).on('keyup', keyUp);

}
// ---------------------= =---------------------
function keyDown(ev)
{
	var key = ev.which;

	switch(key){
		case 65: // left
			movements.left = true;
			break;
		case 68: // right
			movements.right = true;
			break;
		case 83: // down
			movements.down = true;
			break;
		case 87: // up
			movements.up = true;
			break;
	}
}
// ---------------------= =---------------------
function keyUp(ev)
{
	var key = ev.which;

	switch(key){
		case 65: // left
			movements.left = false;
			break;
		case 68: // right
			movements.right = false;
			break;
		case 83: // down
			movements.down = false;
			break;
		case 87: // up
			movements.up = false;
			break;
	}
}
// ---------------------= =---------------------
function spawnMissile()
{
	var angle = generateRandom(0,Math.PI*2);
	var x = Math.cos(angle)*1000 + dropShip.pos.x;
	var y = Math.sin(angle)*1000 + dropShip.pos.y;

	var missile = new Missile(x,y,dropShip);

	engine.addMissile(missile);
}
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------