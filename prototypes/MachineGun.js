// --------------------= =--------------------
function MachineGun(x,y,parent)
{
	Transformable.call(this,x,y);

	this.pos.x = 90;
	this.pos.y = -40;
	this.imgSprite.src = 'img/machine_gun.png';
	this.width = 200;
	this.height = 100;

	this.NEXT_SHOT_THRESHOLD = 100;
	this.SHOTS_ANGLE_HIGH_APERTURE = 20 * (Math.PI/180.0);
	this.SHOTS_ANGLE_LOW_APERTURE = 5 * (Math.PI/180.0);
	this.msAfterLastShot = 0;
	this._parentDropShip = parent;
	this.shooting = false;

	this.update = prototypeMachineGun_update;
	this.drawSprite = prototypeMachineGun_drawSprite;
}
// --------------------= =--------------------
function prototypeMachineGun_update(diff)
{
	var m = this.engine.mouse.pos;
	var p = this._parentDropShip.pos;

	// calculate absolute pos
    var tmpAngle = Math.atan2(this.pos.y,this.pos.x) + this._parentDropShip.angle;
    var displ = Math.sqrt(this.pos.x*this.pos.x + this.pos.y*this.pos.y);

    var mg = {x: Math.cos(tmpAngle)*displ + this._parentDropShip.pos.x,
			  y: Math.sin(tmpAngle)*displ + this._parentDropShip.pos.y};

    // calculate relative angle (in order to point to mouse)
    var absAngle = Math.atan2(m.y-mg.y,m.x-mg.x);
    this.angle = absAngle - this._parentDropShip.angle;

	if(this.isShooting) {
		// shot a bullet every ammount of time
		this.msAfterLastShot -= diff;

		if(this.msAfterLastShot < 0 ) {
			this.msAfterLastShot = this.NEXT_SHOT_THRESHOLD;

			// when DropShip is moving, aperture is higher (according to velocity)
			var aperture = this.SHOTS_ANGLE_LOW_APERTURE + 
				(this.SHOTS_ANGLE_HIGH_APERTURE - this.SHOTS_ANGLE_LOW_APERTURE) * 
				(this._parentDropShip.velocity/this._parentDropShip.MAX_VELOCITY);

			// machine gun 'vibration' when is shooting
			this.angle += aperture/4;

			var bulletAngle = generateRandom(absAngle - aperture, 
										  	 absAngle + aperture);

			engine.addFriendlyBullet(new Bullet(mg.x, mg.y, bulletAngle));
		}
	}
}
// --------------------= =--------------------
function prototypeMachineGun_drawSprite(context)
{
	context.save();
	context.scale(1.0,-1.0); // reverse Y scale (to draw sprite with library)

	context.drawImage(
		this.imgSprite,
		-this.width/2, -this.height/2,
		this.width, this.height);

	context.restore();	
}
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------