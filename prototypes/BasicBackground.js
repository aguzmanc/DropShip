// --------------------= =--------------------
function BasicBackground()
{
	Transformable.call(this,0,0);

	this.PANELSIZE = 400;

	this.patternCreated = false;
	this._fillStyle = null;
	this.imgSprite.src = 'img/bg.png';

	// ----------= OVERRIDE METHODS =----------
	this.draw = prototypeBasicBackground_draw;

	// ----------= NEW METHODS =----------
}
// --------------------= =--------------------
function prototypeBasicBackground_draw(ctx)
{
	if(false == this.patternCreated){
		this.patternCreated = true;
		this._fillStyle = ctx.createPattern(this.imgSprite,'repeat');
	}

	ctx.fillStyle = this._fillStyle;

	var wv = engine.worldVector;

	var minx = parseInt((wv.x - CANVAS_WIDTH/2)/this.PANELSIZE) - ((wv.x - CANVAS_WIDTH/2) < 0.0 ? 1 : 0 );
	var maxx = parseInt((wv.x + CANVAS_WIDTH/2)/this.PANELSIZE) - ((wv.x + CANVAS_WIDTH/2) < 0.0 ? 1 : 0 );

	var miny = parseInt((wv.y - CANVAS_HEIGHT/2)/this.PANELSIZE) - ((wv.y - CANVAS_HEIGHT/2) < 0.0 ? 1 : 0 );
	var maxy = parseInt((wv.y + CANVAS_HEIGHT/2)/this.PANELSIZE) - ((wv.y + CANVAS_HEIGHT/2) < 0.0 ? 1 : 0 );

	var x,y;
	for(x=minx;x<=maxx;x++)
		for(y=miny;y<=maxy;y++)
			ctx.fillRect(x*this.PANELSIZE - 3, y*this.PANELSIZE-3, this.PANELSIZE+3, this.PANELSIZE+3);
}
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