var canvas;
var ctx;
var canvasSize=500;

var backgroundImage = new Image();

// limits are obtained from a error-test check
var MIN_ZOOM_FACTOR = 0.01;
var MAX_ZOOM_FACTOR = 0.7;
var zoom = 1.0; // the actual zoom 
var zoom_factor = 1.0; // value to translate to achieve a better zoom variation (using logarithmic scale)

var worldVector = {x:0,y:0};

var mouseButtons = {right:false,left:false};

var mouseKeys={1:'left',3:'right'};
// ---------------------= =---------------------
$(document).on('ready',function(){
	canvas = document.getElementById('game_canvas');
	canvas.width=canvas.height=canvasSize;

	$(canvas).mousedown(function(ev){mouseButtons[mouseKeys[ev.which]]=true;});
	$(canvas).mouseup(function(ev){mouseButtons[mouseKeys[ev.which]]=false;});
	$(canvas).on('mousemove',mouseMove);

	// disables context menu when right click on mouse
	$(document).bind('contextmenu',function(e){return false;});

	ctx = canvas.getContext('2d');

	backgroundImage.src='img/bg.png';

	setInterval(updateFrame,33);
});
// ---------------------= =---------------------
function updateFrame()
{
	// ------------= ZOOM =------------------
	// to change zoom, affect the zoom_factor in a linear scale
	if(mouseButtons.right)
		zoom_factor += 0.01;

	if(mouseButtons.left) 
		zoom_factor -= 0.01;

	// limits of zoom factor should always exists to avoid 'NaN' problems
	zoom_factor = Math.max(MIN_ZOOM_FACTOR,Math.min(MAX_ZOOM_FACTOR,zoom_factor));

	// then translate zoom factor to zoom in a logarithmic scale
	zoom = Math.abs(Math.log(1/zoom_factor));

	// world visible from plane number 'min' to 'max' (in x and y)
	var planes = {
		x: {
			min: worldVector.x,
			max: 0
		},
		y:{
			min: -worldVector.y,
			max: 0
		}
	};

	// calculates number of planes to be drawn
	planes.x.max = planes.x.min + canvasSize * (1/zoom);
	planes.y.max = planes.y.min + canvasSize * (1/zoom);

	planes.x.min = parseInt(planes.x.min/canvasSize) - (planes.x.min<0?1:0);
	planes.x.max = parseInt(planes.x.max/canvasSize) - (planes.x.max<0?1:0);

	planes.y.min = parseInt(planes.y.min/canvasSize) - (planes.y.min<0?1:0);
	planes.y.max = parseInt(planes.y.max/canvasSize) - (planes.y.max<0?1:0);

	// ------------= WORLD DISPLACEMENT =------------------
	worldVector.x += movementVector.x * 40;
	worldVector.y += movementVector.y * 40;

	ctx.fillStyle='gray';
	ctx.fillRect(0,0,canvasSize,canvasSize);

	ctx.save();
	ctx.scale(zoom,zoom);
	ctx.translate(-worldVector.x,worldVector.y);

	// draw planes
	for(var i=planes.x.min;i<=planes.x.max;i++)
		for(var k=planes.y.min;k<=planes.y.max;k++){
			ctx.fillStyle = ctx.createPattern(backgroundImage,'repeat');
			ctx.fillRect(i*canvasSize,k*canvasSize,canvasSize,canvasSize);	

			ctx.strokeStyle = '#00FF00';
			ctx.lineWidth = 4;
			ctx.strokeRect(i*canvasSize,k*canvasSize,canvasSize,canvasSize);

			ctx.fillStyle = '#00FF00';
			ctx.font = "bold 100px Georgia";
        	ctx.fillText(k,i*canvasSize+canvasSize/2,k*canvasSize+canvasSize/2); 
		}

	ctx.restore();

	// draw movement vector
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'white';
	var halfSize = canvasSize/2;
	ctx.moveTo(halfSize,halfSize);
	ctx.lineTo(halfSize + halfSize*movementVector.x,halfSize-halfSize*movementVector.y);
	ctx.stroke();

	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.arc(halfSize,halfSize,10,10,0,2*Math.PI);
	ctx.fill();
	ctx.beginPath();
	ctx.arc(halfSize + halfSize*movementVector.x,halfSize-halfSize*movementVector.y, 6, 6, 0, 3*Math.PI);
	ctx.fill();

	// draw outer border
	ctx.strokeStyle = 'black';
	ctx.strokeRect(0,0,canvasSize,canvasSize);
}
// ---------------------= =---------------------
// values should go from -1.0 to 1.0 (x and y)
var movementVector = {x:0,y:0};
function mouseMove(ev)
{
	movementVector.x = 2.0 * ev.offsetX/canvasSize - 1.0;
	movementVector.y = 2.0 * (canvasSize-ev.offsetY)/canvasSize - 1.0;
}
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------