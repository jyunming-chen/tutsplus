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

function outputContour ()
{
	var string ="";

	string = string.concat (npoints.toString() + " ");
	
	for (i = 0; i < npoints; i++) {
		var num = myLine.geometry.vertices[MAX_LINE_POINTS - npoints + i].x;
		string = string.concat (num.toString() + " ");
		var num = myLine.geometry.vertices[MAX_LINE_POINTS - npoints + i].y;
		string = string.concat (num.toString() + " ");
	}
	
//	console.log (string);
	return string;
}

// single-space-separated data
function mytok (s, option)
{
	var separator = " ";
	var n = s.indexOf (separator);
	var read = s.substr (0,n);
	
    if (option === 'cut')
        return read;
    else {
	    s = s.substr (++n);  // the rest
    	return s;
    }
}

function tok (s, chars, rtl) 
{
	var n, i = chars.length;
	rtl = true === rtl;
	while (i--) {
		n = s.indexOf (chars[i]);
		s = n < 0 ? s : rtl
			? s.substr (++n)
			: s.substr (0, n);
	}
	return s;
}

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

