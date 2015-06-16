// input q[]
// output joints[]

var axes = [];

function fk (q, joints)
{
	joints[0] = new THREE.Vector3(0,0,0);
	var m = new THREE.Matrix4();
	
	m.makeRotationZ (q[0]);
	m.multiply (new THREE.Matrix4().makeRotationY (q[1]));
	m.multiply (new THREE.Matrix4().makeTranslation(40,0,0));
	var localzero = new THREE.Vector3(0,0,0);
	localzero.applyMatrix4(m);
	joints[1].copy (localzero);
	
	
	m.multiply (new THREE.Matrix4().makeRotationY (q[2]));
	m.multiply (new THREE.Matrix4().makeTranslation(60,0,0));
	localzero = new THREE.Vector3(0,0,0);
	localzero.applyMatrix4(m);
	joints[2].copy (localzero);
}

function setarm ()
{
	var axis = new CCD_axis (new THREE.Vector3(0,0,1), 0);
	//axis.limits = new THREE.Vector2 (0.01, 3.1); 
	axes.push (axis);
	var axis = new CCD_axis (new THREE.Vector3(0,1,0), 0);
	//axis.limits = new THREE.Vector2 (-1.5,1.5); 
	axes.push (axis);
	var axis = new CCD_axis (new THREE.Vector3(0,1,0), 1);
	axis.limits = new THREE.Vector2 (-3.1, -0.01); 
	axes.push (axis);
}

function CLAMP (value,lo,hi)
{
	if (value < lo) return lo;
	if (value > hi) return hi;
	return value;
}