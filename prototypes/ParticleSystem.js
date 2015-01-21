// ---------------------= =---------------------
function ParticleSystem(x,y,generateThreshold,createParticleFunction)
{
	Transformable.call(this, x,y);

	this._particles = [];

	// when this._creationAcumulator reaches threshold, then create new particle
	this._creationAcumulator = 0;
	this.particleGenerationThreshold = generateThreshold;

	if(createParticleFunction !== null)
		this.createParticle = createParticleFunction;

	this.draw = prototypeParticleSystem_draw;
	this.update = prototypeParticleSystem_update;
	this.isDead = prototypeParticleSystem_isDead;
}
// ---------------------= =---------------------
function prototypeParticleSystem_draw(context)
{
	// (no local coordinate system)
	var i,length = this._particles.length;
	for(i=0;i<length;i++)
		this._particles[i].draw(context);
}
// ---------------------= =---------------------
// update particles, also particle generation
function prototypeParticleSystem_update(diff)
{	
	var factor = diff/1000.0;

	this.pos.x += this.velocity * this._mov.x * factor;
	this.pos.y += this.velocity * this._mov.y * factor;

	this._creationAcumulator += diff;

	if(this._creationAcumulator > this.particleGenerationThreshold){
		this._creationAcumulator %= this.particleGenerationThreshold; // remanent

		if(typeof this.createParticle !== 'undefined')
			this._particles.push(this.createParticle());	
	}

	var i,length=this._particles.length;

	for(i=0;i<length;i++){
		var p = this._particles[i];
		p.update(diff);
	}
}
// ---------------------= =---------------------
function prototypeParticleSystem_isDead()
{
	var i,length = this._particles.length;
	if(length==0) return false;

	// if at least one particle is 'alive', all system is still alive
	for(i=0;i<length;i++)
		if(false == this._particles[i].isDead())
			return false; 

	return true;
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
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------
// ---------------------= =---------------------