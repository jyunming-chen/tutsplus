
function loadBoat(boat)
{
	 create_geometry_0(boat.group);
	 create_geometry_1(boat.group);
	 create_geometry_2(boat.group);
	 create_geometry_3(boat.group);
	 create_geometry_4(boat.group);
	 create_geometry_5(boat.group);
	 create_geometry_6(boat.group);
	 create_geometry_7(boat.group);
	 create_geometry_8(boat.group);
}

// boat constructor
var Boat = function (scene, position, theta) {
	this.group = new THREE.Object3D();
	this.pos = (position !== undefined) ? position.clone() : new THREE.Vector3(0,0,0);
	this.vel = new THREE.Vector3();
	this.force = new THREE.Vector3();
	this.power = 0;
	this.theta = (theta !== undefined) ? theta : 0;
	
	loadBoat (this);
	scene.add (this.group);
};

Boat.prototype.step = function (dt) 
{
	var tmp = this.vel.clone();
	tmp.multiplyScalar (dt);  // vel*dt
	this.pos.add (tmp);  // pos = pos + vel*dt;
	 
	tmp = this.force.clone();
	tmp.multiplyScalar (dt);  // force*dt
	this.vel.add (tmp);  // vel = vel + force*dt
	
	if (this.vel.length() > 0) {
		this.theta = Math.atan2 (-this.vel.z, this.vel.x)
	}

	this.group.scale.set (0.3,0.3,0.3);
	this.group.position.set (this.pos.x, this.pos.y+3, this.pos.z);
	this.group.rotation.x = -Math.PI/2;
	this.group.rotation.z = this.theta+Math.PI;
}

Boat.prototype.accumForce = function (power, angle_thrust)
{
	// force: vel-aligned thrust
	var force_gas = new THREE.Vector3(1,0,0);
	force_gas.applyAxisAngle (new THREE.Vector3(0,1,0), angle_thrust);
	force_gas.multiplyScalar (power);

	// force: vel-against damping
	var force_damp = this.vel.clone();
	force_damp.multiplyScalar (-2);

	this.force.addVectors (force_gas, force_damp);
	this.power = power;
}