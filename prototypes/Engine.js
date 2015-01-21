var SINGLETON_ENGINE = null;
var FRAME_FREQUENCY = 13; // in milliseconds
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;
// ---------------------= =---------------------
function Engine()
{
	// ---= MEMBERS =---
	this.canvas = null;
	this.context = null;
	this.processFrameInterval = null;
	// Collection of various types of objects
	this._elements = []; 
	this.friendlyBullets = [];
	this.missiles = [];

	this.background = null; 

	this.mouse = {
		lastScreenPos:{x:0,y:0},
		pos:{x:0,y:0},
		left:false,
		right:false
	};

	// T.O.D.O.: change worldVector inside camera  (to be camera.pos)
	this.worldVector = {x:0.0,y:0.0};
	this.camera = {
		min:{x:0.0,y:0.0},
		max:{x:0.0,y:0.0}
	};

	// ---= METHODS =---
	this.initialize = prototypeEngine_initialize;
	this.update = prototypeEngine_update;
	this.addElement = prototypeEngine_addElement;
	this.removeElement = prototypeEngine_removeElement;
	this.drawBackground = prototypeEngine_drawBackground;

	this.addFriendlyBullet = prototypeEngine_addFriendlyBullet;
	this.addMissile = prototypeEngine_addMissile;

	this.mouseDown = prototypeEngine_mouseDown;
	this.mouseUp = prototypeEngine_mouseUp;
	this.mouseMove = prototypeEngine_mouseMove;

	this.start = prototypeEngine_start;
	this.pause = prototypeEngine_pause;
	this.resume = prototypeEngine_resume;
}
// ---------------------= =---------------------
// Singleton instance of engine
function getEngine()
{
	if(SINGLETON_ENGINE === null)
		SINGLETON_ENGINE = new Engine();

	return SINGLETON_ENGINE;
}
// ---------------------= =---------------------
function prototypeEngine_initialize(canvas_id)
{
	this.canvas = document.getElementById(canvas_id);
	this.canvas.width = CANVAS_WIDTH;
	this.canvas.height = CANVAS_HEIGHT;

	this.context = this.canvas.getContext('2d');
}
// ---------------------= =---------------------
function prototypeEngine_update()
{
	var currentTime = getTime();
	var diff = currentTime - this._lastTime;
	// diff *= 0.07; // DEBUG: SLOW OR FASTEN TIME
	this._lastTime = currentTime;

	var i,length;

	// -------= ----------------- =-------
	// -------= UPDATE BACKGROUND =-------
	// -------= ----------------- =-------
	if(this.background !== null)
		this.background.update(diff);

	// -------= UPDATE WORLD MOUSE POSITION (last known) =-------
	this.mouse.pos.x = this.worldVector.x + (this.mouse.lastScreenPos.x - CANVAS_WIDTH/2);
	this.mouse.pos.y = this.worldVector.y + ((CANVAS_HEIGHT - this.mouse.lastScreenPos.y) - CANVAS_HEIGHT/2);

	// -------= UPDATE CAMERA INFO =-------
	// T.O.D.O. Adjust considering zoom
	this.camera.min.x = this.worldVector.x - CANVAS_WIDTH/2;
	this.camera.max.x = this.worldVector.x + CANVAS_WIDTH/2;
	this.camera.min.y = this.worldVector.y - CANVAS_HEIGHT/2;
	this.camera.max.y = this.worldVector.y + CANVAS_HEIGHT/2;

	// -------= ------------------- =-------
	// -------= UPDATE AND DISPOSE ALL ELEMENTS =-------
	// -------= ------------------- =-------
	length = this._elements.length;
	for(i=length-1;i>=0;i--){
		if(this._elements[i].isDead())
			this._elements.splice(i,1); // delete from list
		else
			this._elements[i].update(diff);
	}

	// dispose from other arrays
	disposeDeadElements(this.friendlyBullets);
	disposeDeadElements(this.missiles);

	// -------= ----------------- =-------
	// -------= DRAW ALL ELEMENTS =-------
	// -------= ----------------- =-------

	// DEBUG: DRAW CANVAS AREA
	this.context.fillStyle = 'white';
	this.context.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	this.context.strokeStyle = 'black';
	this.context.strokeRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	
	// -------= ADJUST GLOBAL WORLD COORDINATES (y pointing up) =-------
	this.context.save();
	this.context.translate(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
	this.context.scale(1.0,-1.0);

	// -------= ADJUST GLOBAL WORLD TRANSFORMATIONS =-------
	this.context.translate(-this.worldVector.x,-this.worldVector.y);
	// this.context.scale(0.3,0.3); // DEBUG: TEST ZOOM

	// draw background first
	this.drawBackground(this.context);

	// drawing here
	length = this._elements.length;
	for(i=0;i<length;i++)
		this._elements[i].draw(this.context);

	this.context.restore();

	// --------------------------= =--------------------------
	// ----------= DRAW ON-SCREEN INFO OF ELEMENTS =----------
	// --------------------------= =--------------------------
	this.context.save();
	this.context.translate(0,CANVAS_HEIGHT);
	this.context.scale(1.0,-1.0);

	length = this._elements.length;
	for(i=0;i<length;i++)
		this._elements[i].drawScreenInfo(this.context);

	this.context.restore();

	// --------------------= =--------------------
	// ---= DRAW HELPER BOUNDS & BOUNDING BOX =---
	// --------------------= =--------------------
	this.context.save();
	this.context.translate(0, CANVAS_HEIGHT);
	this.context.scale(1.0,-1.0);
	this.context.translate(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
	this.context.translate(-this.worldVector.x, -this.worldVector.y);

	length = this._elements.length;
	for(i=0;i<length;i++){
		if(this._elements[i].helpers.boundingBox)
			this._elements[i].drawBoundingBox(this.context);

		if(this._elements[i].helpers.bounds)
			this._elements[i].drawBounds(this.context);
	}

	this.context.restore();
}
// ---------------------= =---------------------
function prototypeEngine_drawBackground(context)
{
	// when background assigned, use it
	if(this.background !== null){
		this.background.draw(context);
		return
	}

	// if not background assigned, draw default
	if(typeof this._backgroundPattern === 'undefined'){
		if(typeof this._imgBg === 'undefined'){
			this._imgBg = new Image();

			this._imgBg.src = 'img/bg.png';
		}

		this._backgroundPattern = context.createPattern(this._imgBg,'repeat');
	}

	context.fillStyle = this._backgroundPattern;
	context.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}
// ---------------------= =---------------------
function prototypeEngine_start()
{
	this._lastTime = getTime();

	this.processFrameInterval = setInterval(function(){getEngine().update();},FRAME_FREQUENCY);
}
// ---------------------= =---------------------
function prototypeEngine_pause()
{
	// T.O.D.O implement pause
}
// ---------------------= =---------------------
function prototypeEngine_resume()
{
	// T.O.D.O implement resume
}
// ---------------------= =---------------------
function prototypeEngine_addElement(newElement)
{
	// T.O.D.O Check if newElement exists in _elements first
	this._elements.push(newElement);
}
// ---------------------= =---------------------
function prototypeEngine_removeElement(element)
{
	// T.O.D.O Check if element exists in _elements first
	this._elements.remove(element);	
}
// ---------------------= =---------------------
function prototypeEngine_addFriendlyBullet(bullet)
{
	this.addElement(bullet);
	this.friendlyBullets.push(bullet);
}
// ---------------------= =---------------------
function prototypeEngine_addMissile(missile)
{
	this.addElement(missile);
	this.missiles.push(missile);
}
// ---------------------= =---------------------
function prototypeEngine_mouseDown(ev)
{
	if(ev.which==1) 
		this.mouse.left = true;
	else if(ev.which==3) 
		this.mouse.right = true;
}
// ---------------------= =---------------------
function prototypeEngine_mouseUp(ev)
{
	if(ev.which==1) 
		this.mouse.left = false;
	else if(ev.which==3) 
		this.mouse.right = false;
}
// ---------------------= =---------------------
function prototypeEngine_mouseMove(ev)
{
	this.mouse.lastScreenPos.x = ev.offsetX;
	this.mouse.lastScreenPos.y = ev.offsetY;	
}
// ---------------------= =---------------------
// gets current time in milliseconds
function getTime()
{
	return new Date().getTime();
}
// ---------------------= =---------------------
function generateIntRandom(max,min)
{
	if(min>max){
		var tmp = max;
		max = min;
		min = tmp;
	}

	return parseInt(min + (Math.random() * (max-min+1)));
}
// ---------------------= =---------------------
function disposeDeadElements(arr)
{
	var i=arr.length-1;
	for(;i>=0;i--){
		if(typeof arr[i]==='undefined') continue;

		if(arr[i].isDead())
			arr = arr.splice(i,1);
	}
}
// ---------------------= =---------------------
function generateRandom(max,min)
{
	if(min>max){
		var tmp = max;
		max = min;
		min = tmp;
	}

	return min + (Math.random() * (max-min));
}
// ---------------------= =---------------------
function generateIntNormalRandom(min,max)
{
	if(min>max){
		var tmp = max;
		max = min;
		min = tmp;
	}

	var r = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) / 6;

	return parseInt(r*(max-min+1)) + min;
};
// ---------------------= =---------------------
function segmentsIntersect(P,Q)
{
	var a = Q.b.x - Q.a.x;
	var b = P.a.x - P.b.x;
	var c = Q.b.y - Q.a.y;
	var d = P.a.y - P.b.y;
	var e = P.a.x - Q.a.x;
	var f = P.a.y - Q.a.y;
	var det = a*d - b*c;

	var s = (e*d-b*f)/det;
	var t = (a*f-c*e)/det;

    return (s >=0 && s<=1 && t>=0 && t<=1);
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