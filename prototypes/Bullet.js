// --------------------= =--------------------
function Bullet(x,y,angle)
{
	Transformable.call(this,x,y);

	this.imgSprite.src = 'img/bullet.png';
	this.width=50;
	this.height=4;
	this.velocity = 2000;

	this.angle = angle;
	this.setDirection(Math.cos(angle),Math.sin(angle));

	this._destroyed = false;

	// -----= METHODS =------
	this.isDead = prototypeBullet_isDead;
	// ----= NEW METHODS =----
	this.hit = prototypeBullet_hit;
}
// --------------------= =--------------------
// ------------------
function prototypeBullet_hit()
{
	// T.O.D.O. Make some animation of bullet impacting in objective (very small explossion)
	this._destroyed = true;
}
// --------------------= =--------------------
function prototypeBullet_isDead()
{
	return this._destroyed;
}
// --------------------= =--------------------
// --------------------= =--------------------
// --------------------= =--------------------
