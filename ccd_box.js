/*
typedef struct {
	int jointid;  // the joint the axis is attached to, from 0
	Vec3 axis;
	Vec2 limits;  // joint limits (radian) [lo, hi]
} CCD_axis;
*/

var CCD_axis = function(axis, id) 
{
	this.jointid = id;
	this.axis = axis.clone();
	this.limits = new THREE.Vector2(-1e4,1e4); // default: no limits
};

//
// generic CCD solver
//

// p: the vector to be projected
// n: the normal defining the projection plane (unit vector)
// clarification: call by reference/pointer or call-by-value
function proj2plane (p, n)
{
	var nclone = n.clone();
	var pclone = p.clone();

	nclone.multiplyScalar (p.dot(n));   // (p.n)n;
	pclone.sub (nclone);
	return pclone;
}

//var axes = [];

function ik_ccd (target, theta)
{
	var end = new THREE.Vector3();
	var base = new THREE.Vector3();
	
	// e.g., njoints = 2;
	// jointid: 0,0,1
	var njoints = axes[axes.length-1].jointid + 1;
	var joints=[];
	for (var i = 0; i <= njoints; i++) joints[i]=new THREE.Vector3();
	
	fk (theta, joints);
	end.copy (joints[njoints]);
	
	// convergence
	var eps = 1e-3, MAXITER = 10;
	
	var t_target = new THREE.Vector3();
	var t_end = new THREE.Vector3();
	var tmpV = new THREE.Vector3();

	// iteration
	
	for (var iter = 0; iter < MAXITER; iter++) {
		for (var i = axes.length-1; i >= 0; i--) {
			base.copy(joints[axes[i].jointid]);
			
			// this part is quite different from the C counterpart
			var axis = axes[i].axis.clone();
			for (var j = i-1; j >= 0; j--) 
				axis.applyMatrix4 (new THREE.Matrix4().makeRotationAxis(axes[j].axis, theta[j])); 
				
			tmpV.subVectors (target, base);	tmpV = proj2plane (tmpV, axis);
			t_target.copy(tmpV.normalize());
			
			tmpV.subVectors (end, base); tmpV = proj2plane (tmpV, axis);
			t_end.copy(tmpV.normalize());

			var dotV = t_end.dot(t_target);
			var angle = Math.acos (CLAMP(dotV, -1,1));
			tmpV.crossVectors (t_end, t_target);
			var sign =  (tmpV.dot (new THREE.Vector3(0,1,0)) > 0) ? 1: -1;
			theta[i] += sign * angle;
			
			// joint limit [-2.4, -0.1]
			theta[i] = CLAMP (theta[i], axes[i].limits[0], axes[i].limits[1])
		
			fk (theta, joints);

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
	
	console.log (joints[2]);
	
	if (iter < MAXITER)
		return 1;
	else {
		console.log ("do not converge");
		return 0;
	}
}
