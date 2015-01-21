// ---------------------= =---------------------
function MissileTrash(x, y, movx, movy)
{
	// no particle generation function
	// these are directly generated in update using SmokeParticle
	ParticleSystem.call(this, x,y, 50, null);

	this.GRAVITY_ACCEL = -9.8;

	this.velocity = generateIntRandom(300,400);

	// generate a motion angle after explossion 
	// close to same direction of original missile
	var movAngle = Math.atan2(movy,movx)*(180.0/Math.PI) + generateIntNormalRandom(-120,120);
	if(movAngle >= 360) movAngle -= 360;
	if(movAngle <= -360) movAngle += 360;

	movAngle *= Math.PI/180.0;

	// defining motion vector
	this._mov.x = Math.cos(movAngle);
	this._mov.y = Math.sin(movAngle);

	this.startingParticleAlpha = 1.0;
	this.startingParticleScale = Math.random()*0.4+0.3;

	var decays=[0.1,0.01,0.05];

	this.decay = decays[parseInt(Math.random()*3)];

	var types = [SMOKE_PARTICLE_TYPE_VERY_HIGH, SMOKE_PARTICLE_TYPE_LOW, SMOKE_PARTICLE_TYPE_MEDIUM];
	this.particleType = types[parseInt(Math.random()*3)]; 

	// -----= METHODS =-----
	this.update = prototypeMissileTrash_update;
}
// ---------------------= =---------------------
function prototypeMissileTrash_update(diff)
{
	var factor = diff/1000.0;

	// recalculate velocity and movement with gravity accel
	var velx = this.velocity * this._mov.x;
	var vely = this.velocity * this._mov.y;

	vely += this.GRAVITY_ACCEL;

	this.velocity = Math.sqrt(velx*velx + vely*vely);
	this._mov.x = velx/this.velocity;
	this._mov.y = vely/this.velocity;

	// update vel
	this.pos.x += this.velocity * this._mov.x * factor;
	this.pos.y += this.velocity * this._mov.y * factor;

	// create a new particle every amount of time
	this._creationAcumulator += diff;

	if(this._creationAcumulator > this.particleGenerationThreshold) {
		this._creationAcumulator %= this.particleGenerationThreshold; // remanent

		var s = new SmokeParticle(this.pos.x, this.pos.y, 0.8, this.particleType);
		s.scale= this.startingParticleScale;
		s.alpha = this.startingParticleAlpha;
		this.startingParticleAlpha -= this.decay;

		this._particles.push(s);	
	}

	// -----= UPDATE PARTICLES =-----
	var i,length=this._particles.length;

	for(i=0;i<length;i++)
		this._particles[i].update(diff);
}