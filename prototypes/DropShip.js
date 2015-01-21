// --------------------= =--------------------
function DropShip()
{
	Transformable.call(this,0,0);

	this.MAX_VELOCITY = 331;

	this.imgSprite.src = 'img/dropship.png';
	this.width=250;
	this.height=117;

	this._accelerationVector = {x:0.0,y:0.0};
	this.acceleration = 405; // fixed for this dropship

	this.isImpulsed = false;
	this._millisecondsToLostImpulse = 0.0;
	this._movements = null;

	this._machineGun = new MachineGun(this.pos.x, this.pos.y,this);
	this._machineGun.scale = 0.3;
	this.tag='dropship';
	this._hit = false;

	// --------= NEW METHODS =----
	this.update = prototypeDropShip_update;
	this.draw = prototypeDropShip_draw;
	this.drawSprite = prototypeDropShip_drawSprite;
	this.setAccelerationVector = prototypeDropShip_setAccelerationVector;
	this.setImpulse = prototypeDropShip_setImpulse;
	this.setMovementsObject = prototypeDropShip_setMovementsObject;

	this.drawBoundingBox = prototypeDropShip_drawBoundingBox;
}
// --------------------= =--------------------
function prototypeDropShip_update(diff)
{
	// synchronize with action movements first
	if(this._movements.up || this._movements.down || this._movements.right || this._movements.left){
		var x=0,y=0;
		if(this._movements.up) y=1;
		if(this._movements.down) y=-1;
		if(this._movements.left) x=-1;
		if(this._movements.right) x = 1;

		this.setImpulse(x,y);
	}

	// first check if ship is being impulsed
	this._millisecondsToLostImpulse -= diff;
	this._millisecondsToLostImpulse = Math.max(0, this._millisecondsToLostImpulse);

	if(this._millisecondsToLostImpulse==0)
		this.isImpulsed = false;

	var factor = diff/1000.0;

	if(this.isImpulsed) {
		// apply acceleration
		var velx = this._mov.x * this.velocity;
		var vely = this._mov.y * this.velocity;

		velx += this._accelerationVector.x * this.acceleration * factor;
		vely += this._accelerationVector.y * this.acceleration * factor;

		this.velocity = Math.sqrt(velx*velx + vely*vely);

		this._mov.x = velx/this.velocity;
		this._mov.y = vely/this.velocity;

		// when movement is applied, check max velocity
		this.velocity = Math.min(this.MAX_VELOCITY, this.velocity);
	}
	else {
		// if not impulsed, should be disaccelerate and
		// try to reach velocity = 0
		this.setAccelerationVector(0,0);

		var DISACCELERATION = 230.0;
		this.velocity -= DISACCELERATION * factor;
		this.velocity = Math.max(0,this.velocity);
	}

	// angle when ship is moving
	velx = this._mov.x * this.velocity;
	this.angle = -(velx/this.MAX_VELOCITY) * (Math.PI/8);

	// position
	this.pos.x += this.velocity * this._mov.x * factor;
	this.pos.y += this.velocity * this._mov.y * factor;

	// UPDATE MACHINE GUN
	this._machineGun.isShooting = engine.mouse.left; // shot when click mouse
	this._machineGun.update(diff);

	// World Vector is the same as the position of the ship
	// so, the ship is always in the middle
	// T.O.D.O: Implement some kind of "try to be in the middle"
	// according to ship movements
	// to improve effect of reality
	this.engine.worldVector.x = this.pos.x;
	this.engine.worldVector.y = this.pos.y;

	// check if missile hit the ship
	var i,length = this.engine.missiles.length;
	for(i=0;i<length;i++)
		if(this.collidesWith(this.engine.missiles[i]))
			this.engine.missiles[i].explode();
}
// --------------------= =--------------------
function prototypeDropShip_draw(context)
{
	// normal drawing
	context.save();

	context.translate(this.pos.x, this.pos.y);
	context.rotate(this.angle);
	context.scale(this.scale,-this.scale); // reverse Y scale (to draw sprite with library)

	this.drawSprite(context);

	context.scale(this.scale,-this.scale); // restore Y scale after draw sprite

	this._machineGun.draw(context);

	context.restore();
}
// --------------------= =--------------------
function prototypeDropShip_drawSprite(context)
{
	context.drawImage(
		this.imgSprite,
		-this.width/2, -this.height/2,
		this.width, this.height);
}
// --------------------= =--------------------
function prototypeDropShip_drawBoundingBox(context)
{
	var bb = this.getBoundingBox();

	context.strokeStyle = this._hit?'#FF0000':'#00FF00';// red or green

	context.lineWidth=2;
	context.strokeRect(bb.x,bb.y,bb.w,bb.h);
}
// --------------------= =--------------------
function prototypeDropShip_setAccelerationVector(x,y)
{
	var v = Math.sqrt(x*x + y*y);
	this._accelerationVector.x = x/v;
	this._accelerationVector.y = y/v;
}
// --------------------= =--------------------
function prototypeDropShip_setImpulse(x,y)
{
	this.setAccelerationVector(x,y);
	this.isImpulsed = true;

	var IMPULSE_MILLISECONDS = 200;
	this._millisecondsToLostImpulse = IMPULSE_MILLISECONDS;
}
// --------------------= =--------------------
function prototypeDropShip_setMovementsObject(movements)
{
	this._movements = movements;
}
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------