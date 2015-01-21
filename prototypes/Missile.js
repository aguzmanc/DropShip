// ---------------------= =---------------------
function Missile(xIni, yIni, target)
{
	Transformable.call(this, xIni, yIni);

	this.width = 186;
	this.height = 62;
	this.scale=0.4;
	this.AIM_ANGLE_THRESHOLD = (Math.PI/180.0) * 4.0;
	this.FIXED_ANGULAR_VEL =  Math.PI/2;
	this.velocity = 400.0; // fixed for this type of missile

	this.imgSprite.src = 'img/missile.png';

	this.imgHit = new Image();
	this.imgHit.src = 'img/missile_hit.png';

	this._destroyed = false;
	this.target = target;
	this.tag = 'missile';

	this.MS_SHOW_HIT = 50;
	this._msLeftShowHit = 0; // missile is not being hit at beginning
	this._hitsToDestroy = 1; // 

	// --------= OVERRIDE METHODS =--------
	this.update = prototypeMissile_update;
	this.drawScreenInfo = prototypeMissile_drawScreenInfo;
	this.drawSprite = prototypeMissile_drawSprite;
	this.isDead = prototypeMissile_isDead;
	// --------= NEW METHODS =--------
	this.getMarginInfo = prototypeMissile_getMarginInfo;
	this.explode = prototypeMissile_explode;

	// extra data
	this._let = ['a','b','c'];
	var SQ = Math.PI/4.0; // 45 degrees

	// defines offset angle for the arrow of margin info
	// when zero degrees , is an arrow pointing to left 
	//  <|
	this._onScreenAngles={
		aa: SQ,
		ab:0,
		ac: -SQ,
		ba: 2*SQ,
		bb: -1, // not applicable
		bc: -2*SQ,
		ca: 3*SQ,
		cb: 4*SQ,
		cc: -3*SQ
	}
}
// ---------------------= =---------------------
function prototypeMissile_update(diff)
{
	var factor = diff/1000.0;

	// vector from missile to target
	var t = {
		x: this.target.pos.x - this.pos.x,
		y: this.target.pos.y - this.pos.y
	};

	// determines if rotates left or right to reach target
	var angDiff = Math.atan2(t.y,t.x) - Math.atan2(this._mov.y,this._mov.x);

	// only changes angle when difference between angles is substantial
	if(Math.abs(angDiff) > this.AIM_ANGLE_THRESHOLD){
		if(angDiff < -Math.PI) // angle (should be > -180)
			angDiff += Math.PI * 2; // angle fix correction 

		// if missile turns left or right
		this.angularVelocity = ((angDiff > 0) ? 1.0:-1.0) * this.FIXED_ANGULAR_VEL;

		// updates movement angle (using vector angle)
		var newAngle = Math.atan2(this._mov.y, this._mov.x) + this.angularVelocity * factor;
		this._mov.x = Math.cos(newAngle);
		this._mov.y = Math.sin(newAngle);
	}

	// show if this missile is being damaged
	this._msLeftShowHit = Math.max(0,this._msLeftShowHit-diff);

	this.pos.x += this.velocity * this._mov.x * factor;
	this.pos.y += this.velocity * this._mov.y * factor;

	this.angle = Math.atan2(this._mov.y,this._mov.x);

	var i,length = this.engine.friendlyBullets.length;
	for(i=0;i<length;i++)
		if(this.collidesWith(this.engine.friendlyBullets[i])){
			this.engine.friendlyBullets[i].hit();
			this._msLeftShowHit = this.MS_SHOW_HIT;
			this._hitsToDestroy--;

			if(this._hitsToDestroy<=0)
				this.explode();

			break;
		}
}
// ---------------------= =---------------------
function prototypeMissile_drawSprite(context)
{
	var img = (this._msLeftShowHit==0?this.imgSprite:this.imgHit);

	context.drawImage(
		img,
		-this.width/2, -this.height/2,
		this.width, this.height);
}
// ---------------------= =---------------------
function prototypeMissile_drawScreenInfo(ctx)
{
	// -----= DRAW MISSILE INFO IN MARGINS (when not in view) =-----
	var info = this.getMarginInfo();

	if(!(info.hor==0 && info.ver==0)){
		var rot = 0.0;

		var code = this._let[info.hor+1] + this._let[info.ver+1];

		var MAX_DIST = 1500;
		var distFactor = parseInt((  Math.min(MAX_DIST,info.distance) /MAX_DIST)*255.0);

		ctx.save();
		ctx.fillStyle = "#" + ("00"+(255-distFactor).toString(16)).substr(-2) + ("00"+distFactor.toString(16)).substr(-2) + "00";
		ctx.translate(info.pos.x,info.pos.y);
		ctx.rotate(this._onScreenAngles[code]);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(20,-10);
		ctx.lineTo(20,10);
		ctx.lineTo(0,0);
		ctx.fill();
		ctx.restore();

		var x = Math.max(30,Math.min(CANVAS_WIDTH-70,info.pos.x));
		var y = Math.max(30,Math.min(CANVAS_HEIGHT-40,info.pos.y));

		ctx.save();

		// world has inverted x axis (from engine), 
		// so, in order to draw Text, it should be re inverted again
		ctx.scale(1.0,-1.0); 
		ctx.translate(x,-y);

		ctx.fillStyle='white';
		ctx.font="20px Georgia";
		ctx.fillText(("000"+info.distance.toString(10)).substr(-3),0,0);

		ctx.restore();
	}
}
// ---------------------= =---------------------
function prototypeMissile_isDead()
{
	return this._destroyed;
}
// ---------------------= =---------------------
function prototypeMissile_getMarginInfo()
{
	var bb = this.getBoundingBox();
	var cam = this.engine.camera;

	var res={
		distance: 0.0,
		pos:{x:0,y:0},
		hor:0,  // -1,0 or 1
		ver:0	// -1,0 or 1
	};

	// calculates margin positions
	res.pos.x = Math.max(cam.min.x,Math.min(this.pos.x,cam.max.x));
	res.pos.y = Math.max(cam.min.y,Math.min(this.pos.y,cam.max.y));

	res.pos.x = parseInt(((res.pos.x - cam.min.x)/(cam.max.x - cam.min.x)) * CANVAS_WIDTH);
	res.pos.y = parseInt(((res.pos.y - cam.min.y)/(cam.max.y - cam.min.y)) * CANVAS_HEIGHT);

	var dx=0.0,
		dy=0.0;

	// horizontal info
	if(bb.x+bb.w < cam.min.x){
		res.hor = -1,
		dx = Math.abs(cam.min.x - (bb.x + bb.w));
	}else if(bb.x > cam.max.x){
		res.hor = 1,
		dx = Math.abs(bb.x - cam.max.x);
	}else 
		res.hor=0;

	// vertical info
	if(bb.y+bb.h < cam.min.y) {
		res.ver = -1;
		dy = Math.abs(cam.min.y -(bb.y+bb.h));
	}else if(bb.y > cam.max.y){
		res.ver = 1;
		dy= Math.abs(bb.y - cam.max.y);
	} else 
		res.ver=0;

	res.distance = parseInt(Math.sqrt(dx*dx+dy*dy));

	return res;
}
// ---------------------= =---------------------
function prototypeMissile_explode()
{
	this.engine.addElement(new MissileExplossion(this.pos.x, this.pos.y, this._mov.x, this._mov.y));
	this._destroyed = true;
}
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------