//
// ad hoc CCD solver for two-link arm
//
function fk2 (theta1, theta2, joints)
{
	joints[0] = new THREE.Vector3(0,0,0);
	var m = new THREE.Matrix4();
	
	m.makeRotationY (theta1);
	m.multiply (new THREE.Matrix4().makeTranslation(60,0,0));
	var localzero = new THREE.Vector3(0,0,0);
	localzero.applyMatrix4(m);
	joints[1].copy (localzero);
	
	m.multiply (new THREE.Matrix4().makeRotationY (theta2));
	m.multiply (new THREE.Matrix4().makeTranslation(90,0,0));
	localzero = new THREE.Vector3(0,0,0);
	localzero.applyMatrix4(m);
	joints[2].copy (localzero);
}

function CLAMP (value,lo,hi)
{
	if (value < lo) return lo;
	if (value > hi) return hi;
	return value;
}

function ik_ccd (target, theta)
{
	var end = new THREE.Vector3();
	var base = new THREE.Vector3();
	var joints=[];
	for (var i = 0; i < 3; i++) joints[i]=new THREE.Vector3();
	
	fk2 (theta[0], theta[1], joints);
	end.copy (joints[2]);
	
	// convergence
	var eps = 1e-3, MAXITER = 10;
	
	var t_target = new THREE.Vector3();
	var t_end = new THREE.Vector3();
	var tmpV = new THREE.Vector3();

	for (var iter = 0; iter < MAXITER; iter++) {
		for (var i = 1; i >= 0; i--) {
			base.copy(joints[i]);
			tmpV.subVectors (target, base);
			t_target.copy(tmpV.normalize());
			tmpV.subVectors (end, base);
			t_end.copy(tmpV.normalize());

			var dotV = t_end.dot(t_target);
			var angle = Math.acos (CLAMP(dotV, -1,1));
			tmpV.crossVectors (t_end, t_target);
			var sign =  (tmpV.dot (new THREE.Vector3(0,1,0)) > 0) ? 1: -1;
			theta[i] += sign * angle;
			
			// joint limit [-2.4, -0.1]
			theta[1] = CLAMP (theta[1], -3, -0.051)
		
			// convergence check
			theta1 = theta[0], theta2 = theta[1];
			fk2 (theta1, theta2, joints);

			/*  ... debugging (for out-of-bound target, produce NaN angle)			
			if (isNaN(theta1) || isNaN(theta2)) {
				console.log ("here");
				debugger;
			}
			*/				
			end.copy(joints[2]);
			tmpV.subVectors (target, end);
			var err = tmpV.length();
			if (err < eps) {
				return 1;
			}
		}
	}
	
	
	if (iter < MAXITER)
		return 1;
	else {
		console.log ("do not converge");
		return 0;
	}
}
