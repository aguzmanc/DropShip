// ---------------------= =---------------------
function MissileExplossion(x, y, movx, movy)
{
	Transformable.call(this,x,y);

	this._trashes = [];

	var TOTAL_TRASHES = generateIntRandom(3,5);

	for(var i=0;i<TOTAL_TRASHES;i++)
		this._trashes.push(new MissileTrash(x,y,movx,movy));

	this._innerExplossion = new Explossion(x,y);
	this.tag = 'missile_explossion';

	this.draw = prototypeMissileExplossion_draw;
	this.update = prototypeMissileExplossion_update;
	this.isDead = prototypeMissileExplossion_isDead;

	this.drawSprite = function(ctx){}; // no drawing for the main node
}
// ---------------------= =---------------------
function prototypeMissileExplossion_update(diff)
{
	var i,length = this._trashes.length;

	for(i=0;i<length;i++)
		this._trashes[i].update(diff);

	this._innerExplossion.update(diff);
}
// ---------------------= =---------------------
function prototypeMissileExplossion_draw(context)
{
	var i,length = this._trashes.length;

	for(i=0;i<length;i++)
		this._trashes[i].draw(context);	

	this._innerExplossion.draw(context);
}
// ---------------------= =---------------------
function prototypeMissileExplossion_isDead()
{
	var i=0,length = this._trashes.length;
	// if at least one 'alive', all is 'alive'
	for(;i<length;i++)
		if(this._trashes[i].isDead() == false)
			return false;

	// last word: check explossion
	return this._innerExplossion.isDead();
}
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------