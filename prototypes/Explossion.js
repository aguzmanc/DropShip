// ---------------------= =---------------------
function Explossion(x, y)
{
	// no particle generation function
	// these are directly generated in update using SmokeParticle
	ParticleSystem.call(this, x,y, 50, null);

	var totalParticles = generateIntRandom(50,70);

	var i;
	// parameters to generate each type of particle
	var decays=[1.0,2.0,0.7];
	var velocities = [50,200,20];
	var types=[	SMOKE_PARTICLE_TYPE_VERY_HIGH, 
				SMOKE_PARTICLE_TYPE_HIGH, 
				SMOKE_PARTICLE_TYPE_MEDIUM];

	for(i=0;i<totalParticles;i++){
		// defining motion vector
		var movAngle = generateIntRandom(0,360) * (Math.PI/180.0);
		var particleType = parseInt(Math.random()*3);

		var s = new SmokeParticle(this.pos.x, this.pos.y, decays[particleType], types[particleType]);
		s._mov.x = Math.cos(movAngle);
		s._mov.y = Math.sin(movAngle);
		s.scale = 0.4;
		s.velocity = velocities[particleType];

		this._particles.push(s);	
	}
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