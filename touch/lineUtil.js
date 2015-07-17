var npoints = 0;
var MAX_LINE_POINTS = 100;

function clearLine ()
{
	console.log (scene.children.length);
	scene.remove (myLine);
	npoints = 0;
	nolineyet = true;
	
	render();
}

function outputContour2 () {
	var ll = {};
	ll.npoints = npoints;
	ll.coords = [];
	for (var i = 0; i < npoints; i++) {
		ll.coords.push (myLine.geometry.vertices[MAX_LINE_POINTS - npoints + i].x);
		ll.coords.push (myLine.geometry.vertices[MAX_LINE_POINTS - npoints + i].y);
	}
	
	var string = JSON.stringify (ll);
	return string;
}

function readContour2 (ss) {
	var ll = JSON.parse (ss);
	var n = ll.npoints;

	var lineGeometry = new THREE.Geometry();
	var vertArray = lineGeometry.vertices;
	for (var i = 0; i < 2*n; i+=2) {
		vertArray.push (new THREE.Vector3 (ll.coords[i], ll.coords[i+1],0));
	}
	var lineMaterial = new THREE.LineBasicMaterial( { color: 0x00cc00 } );

	var newline = new THREE.Line( lineGeometry, lineMaterial );
	scene.add (newline);
	return newline;
}

/////////////////////////////////////////////////
// contour output as
//   3 x1 y1 x2 y2 x3 y3
///////////////////////////////////////////
function outputContour ()
{
	var string ="";

	string = string.concat (npoints.toString());
	
	for (i = 0; i < npoints; i++) {
		var num = myLine.geometry.vertices[MAX_LINE_POINTS - npoints + i].x;
		string = string.concat (" " + num.toString());
		var num = myLine.geometry.vertices[MAX_LINE_POINTS - npoints + i].y;
		string = string.concat (" " + num.toString());
	}
	// change to preceding space (rather than trailing space
	// caused problem in string.split()
	
	console.log (string);
	return string;
}

function readContour (ss) 
{
	var ssComponents = ss.split (" ");
	var n = ssComponents[0];
//	console.log ('n: ' + ssComponents[0]);

	var lineGeometry = new THREE.Geometry();
	var vertArray = lineGeometry.vertices;
//	console.log ('ss length: ' + ssComponents.length); 
	for (var i = 1; i < ssComponents.length; i+= 2) {
		vertArray.push (new THREE.Vector3 (ssComponents[i], ssComponents[i+1],0));
	}
/*	
	console.log (vertArray.length);
	for (var i = 0; i < vertArray.length; i++) {
		console.log (vertArray[i].x + ', ' +vertArray[i].y);
	}
*/
	var lineMaterial = new THREE.LineBasicMaterial( { color: 0x00cc00 } );

	var newLine = new THREE.Line( lineGeometry, lineMaterial )
	scene.add (newLine);
	return newLine;
}

/*
function readContour (ss)
{
	console.log (ss);
	
	// s1 = tok (ss, separator) ... returns the 
	//	var n = tok (ss, " ");	//ss = tok (ss, " ", true);

	var n = mytok (ss, "cut");
	ss = mytok (ss, "rest");
	
	var x, y;
	//x = tok (ss, " "); ss = tok (ss, " ", true);
	//y = tok (ss, " "); ss = tok (ss, " ", true);
	x = mytok (ss,"cut"); ss = mytok (ss,"rest");
	y = mytok (ss,"cut"); ss = mytok (ss,"rest");
	
	//	console.log (x+", " +y);
	
	myLine = createNewLine (new THREE.Vector3 (x,y,0));
	scene.add (myLine);
	
	for (i = 1; i < n; i++) {
//		x = tok (ss, " "); ss = tok (ss, " ", true);
//		y = tok (ss, " "); ss = tok (ss, " ", true);
	x = mytok (ss,"cut"); ss = mytok (ss,"rest");
	y = mytok (ss,"cut"); ss = mytok (ss,"rest");
	
		addPoint (new THREE.Vector3 (x,y,0));
	}
}
*/
///////////////////////////////////////////////////////////////////////////////

/* this wont work...
function createNewLine (startingPoint) 
{
    var geometry = new THREE.Geometry();
	
	geometry.vertices.push(startingPoint.clone());
    myLine =  new THREE.Line(geometry,  new THREE.LineBasicMaterial( { color: 0x222222 } ));

    return myLine;
}

function addPoint (myPoint)
{
	myLine.geometry.vertices.push (myPoint);
	myLine.geometry.verticesNeedUpdate = true;
	
	console.log ("points: ", myLine.geometry.vertices.length);
}
*/

function createNewLine(startingPoint){
    var geometry = new THREE.Geometry();
	
	for (var i = 0; i < MAX_LINE_POINTS; i++) {
		geometry.vertices.push(startingPoint.clone());
    }

    myLine =  new THREE.Line(geometry,  new THREE.LineBasicMaterial( { color: 0x222222 } ));
    // myLine.geometry.dynamic = true; // default

    return myLine;
}

function addPoint(myPoint) 
{
	myLine.geometry.vertices.shift();
	myLine.geometry.vertices.push (myPoint);
	
	myLine.geometry.verticesNeedUpdate = true;
}


/*
function closeTheLoop()
{
	myLine.geometry.vertices.shift();
	myLine.geometry.vertices.push (myLine.geometry.vertices[0].clone());
}
*/

