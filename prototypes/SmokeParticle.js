var SMOKE_PARTICLE_TYPE_VERY_LOW = 0;
var SMOKE_PARTICLE_TYPE_LOW = 1;
var SMOKE_PARTICLE_TYPE_MEDIUM = 2;
var SMOKE_PARTICLE_TYPE_HIGH = 3;
var SMOKE_PARTICLE_TYPE_VERY_HIGH = 4;
// ---------------------= =---------------------
function SmokeParticle(x, y, alphaDecay, intensity)
{
	Transparent.call(this, x,y, 1.0);

	this.velocity = 20.0;
	this.width = 100;
	this.height = 100;

	this._alphaDecay = Math.max(0,alphaDecay);

	// 'imageVariation' can be 0, 1 or 2
	this._imageVariation = parseInt(Math.random()*3); // 0 1 or 2

	// 'intensity' can be 0 1,2,3 or 4
	if( intensity==SMOKE_PARTICLE_TYPE_VERY_HIGH || 
		intensity==SMOKE_PARTICLE_TYPE_HIGH || 
		intensity==SMOKE_PARTICLE_TYPE_MEDIUM || 
		intensity==SMOKE_PARTICLE_TYPE_LOW || 
		intensity==SMOKE_PARTICLE_TYPE_VERY_LOW)
			this._intensity = intensity;
	else this._intensity = SMOKE_PARTICLE_TYPE_VERY_LOW ; // default

	// random direction when generated
	var movAngle = parseInt(Math.random()*360) * (Math.PI/180.0);
	this.setDirection(Math.sin(movAngle),Math.cos(movAngle));

	this.angularVelocity = 0.9;

	// random angle
	this.angle = (Math.PI/180.0) * parseInt(Math.random() * 181);
	if(Math.random() > 0.5) 
		this.angle *= -1.0;

	this.imgSprite.src = 'img/explossions.png';

	// ------= METHODS =--------
	this.setAlphaDecay = function(decay){
		_alphaDecay = Math.max(0.0 ,Math.min(1.0,decay));
	};

	this.isDead = function(){return (this.alpha==0);}

	this.update = prototypeSmokeParticle_update;
	this.drawSprite = prototypeSmokeParticle_drawSprite;
}
// ---------------------= =---------------------
function prototypeSmokeParticle_update(diff)
{
	var factor = diff/1000.0;

	this.pos.x += this.velocity * this._mov.x * factor;
	this.pos.y += this.velocity * this._mov.y * factor;

	this.angle += this.angularVelocity * factor;

	this.alpha -= this._alphaDecay * factor;
	this.alpha = Math.max(0,this.alpha);
}
// ---------------------= =---------------------
function prototypeSmokeParticle_drawSprite(context)
{
	context.drawImage(
		this.imgSprite,
		this._intensity * this.width, this._imageVariation * this.height,
		this.width, this.height,
		-this.width/2, -this.height/2,
		this.width, this.height);
}
// ---------------------= =---------------------
// ---------------------= =---------------------