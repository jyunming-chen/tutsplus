var MAXSPEED = 25, MAXFORCE = 25;
var REACH = 50;
var ARRIVAL_R = 30;

var Obstacle = function (center,size) {
	this.center = center.clone();  
	this.mesh = new THREE.Mesh (new THREE.CylinderGeometry(size,size,1,20),
			new THREE.MeshBasicMaterial());
	this.mesh.position.copy (center);
	this.size = size;
};

var Agent = function (pos, vel) {
	this.pos = pos.clone();
	this.vel = vel.clone();
	this.force = new THREE.Vector3();
	this.target = new THREE.Vector3();
	this.size = 3;  // physical size of the character
	this.mesh = new THREE.Mesh (new THREE.CylinderGeometry(3,3,1,20),
			new THREE.MeshBasicMaterial({color:0xff0000}));
};

Agent.prototype.step = function (dt) 
{
	this.accumForce();
	
	// vel += force*dt
	var tmp = this.force.clone();
	tmp.multiplyScalar (dt);
	this.vel.add (tmp);  

	// velocity modulation by arriving
	var diff = new THREE.Vector3();
	diff.subVectors (this.target, this.pos);
	var dst = diff.length();
	if (dst < ARRIVAL_R) {
		this.vel.setLength (dst);	
	}
	
	// pos += vel*dt
	tmp.copy (this.vel);
	tmp.multiplyScalar (dt);
	this.pos.add (tmp); 
};

Agent.prototype.accumForce = function ()
{
	// clear force accumulator
	this.force.set (0,0,0);
	
	var sum = new THREE.Vector3(0,0,0);
	
	// seek
	var tmp = new THREE.Vector3();
	tmp.subVectors (this.target, this.pos);
	tmp.normalize();
	tmp.multiplyScalar (MAXSPEED);
	sum.subVectors (tmp, this.vel);

	// collision
	var vhat = this.vel.clone().normalize();
	tmp.subVectors (ob.center, this.pos); // c-p
	var tll = tmp.dot(vhat);

	if (tll > 0 && tll < REACH) {
		vhat.multiplyScalar (tll);
		var tperp = new THREE.Vector3();
		tperp.subVectors (tmp, vhat);
		if (tperp.length() < ob.size+this.size) {
			tperp.negate();
			sum.add (tperp);
			console.log ("hit", tperp);
		}
	}
	
	this.force.copy (sum);
}
