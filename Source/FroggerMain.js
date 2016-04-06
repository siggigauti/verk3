
var canvas;
var gl;
var YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
var BLUE = vec4(0.0, 0.0, 1.0, 1.0);
var RED = vec4(1.0, 0.0, 0.0, 1.0);
var GRAY = vec4(0.4, 0.4, 0.4, 1.0);
var BLACK = vec4(0, 0, 0, 1.0);
var GREEN = vec4(0, 0.6, 0, 1.0);
var WATERBLUE = vec4(0, 0, 0.5, 1.0);
var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;
var numCubeVertices  = 36;



var height = 0.0;
var turn = 0.0;


var frog;
var cars = [];
var lumbers = [];
var numCarsPerLane = 2;

var colorLoc;
var mvLoc;
var pLoc;
var proj;

var cubeBuffer;
var trackBuffer;
var vPosition;


// the 36 vertices of the cube
var cVertices = [
    // front side:
    vec3( -0.5,  0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ),
    // right side:
    vec3(  0.5,  0.5,  0.5 ), vec3(  0.5, -0.5,  0.5 ), vec3(  0.5, -0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ), vec3(  0.5,  0.5,  0.5 ),
    // bottom side:
    vec3(  0.5, -0.5,  0.5 ), vec3( -0.5, -0.5,  0.5 ), vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5, -0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3(  0.5, -0.5,  0.5 ),
    // top side:
    vec3(  0.5,  0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3( -0.5,  0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ), vec3(  0.5,  0.5,  0.5 ), vec3(  0.5,  0.5, -0.5 ),
    // back side:
    vec3( -0.5, -0.5, -0.5 ), vec3( -0.5,  0.5, -0.5 ), vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ), vec3(  0.5, -0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ),
    // left side:
    vec3( -0.5,  0.5, -0.5 ), vec3( -0.5, -0.5, -0.5 ), vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ), vec3( -0.5,  0.5, -0.5 ),
	
	//Jörðin byrjar í 36
	
	//Vinningssvæðið er 2x10 ferningur
	vec3(10.5, 10.5, 0), vec3(-10.5, 10.5, 0), vec3(-10.5, 7.5, 0),
	vec3(10.5, 10.5, 0), vec3(10.5, 7.5, 0), vec3(-10.5, 7.5, 0),
	
	//Áin er 7x10 ferningur
	vec3(10.5, 7.5, 0), vec3(-10.5, 7.5, 0), vec3(-10.5, 0.5, 0),
	vec3(10.5, 7.5, 0), vec3(10.5, 0.5, 0), vec3(-10.5, 0.5, 0),
	
	//Miðjusvæði er 2x10 ferningur
	vec3(10.5, 0.5, 0), vec3(-10.5, 0.5, 0), vec3(-10.5, -1.5, 0),
	vec3(10.5, 0.5, 0), vec3(10.5, -1.5, 0), vec3(-10.5, -1.5, 0),
	
	//Gatan er 7x10 ferningur
	vec3(10.5, -1.5, 0), vec3(-10.5,  -1.5, 0), vec3(-10.5, -7.5, 0),
	vec3(10.5, -1.5, 0), vec3(10.5, -7.5, 0), vec3(-10.5, -7.5, 0),
	
	//Byrjunarsvæðið er 2x10 ferningur
	vec3(10.5, -7.5, 0), vec3(-10.5, -7.5, 0), vec3(-10.5, -10.5, 0),
	vec3(10.5, -7.5, 0), vec3(10.5, -10.5, 0), vec3(-10.5, -10.5, 0),
];

// vertices of the track
var tVertices = [];


var xMovement = 0;
var yMovement = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
	
		initCars()
		initLumbers();
		
		frog = new Frog();
		
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 1.0, 0.7, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cVertices), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );
    
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // set projection
    pLoc = gl.getUniformLocation( program, "projection" );
    proj = perspective( 50.0, 1.0, 1.0, 500.0 );
    gl.uniformMatrix4fv(pLoc, false, flatten(proj));

            
	canvas.addEventListener("mousedown", function(e){
	movement = true;
	origX = e.clientX;
	origY = e.clientY;
	e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (e.clientX - origX) ) % 360;
            spinX = ( spinX + (e.clientY - origY) ) % 360;
            origX = e.clientX;
            origY = e.clientY;
        }
    } );
	// Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 87:	// W
                frog.moveY(1);
                break;
            case 83:	// S
                frog.moveY(-1);
                break;
			case 68:	// D
				frog.moveX(1);
				break;
			case 65:	// A
				frog.moveX(-1);
				break;
		}
	} );
    render();
}
function getRandomNumber(high, low){
	return Math.random() * (high - low) + low;	
}

function initCars(){
	var xMin = -10, xMax = -6, xStartPos, laneSpeed;
	for(var i = 2; i<8; i++){
		laneSpeed = getRandomNumber(0.02, 0.05);
		for(var j = 0; j<numCarsPerLane; j++){
			xStartPos = getRandomNumber(xMin, xMax);
			cars.push( new Car(-i, xStartPos, laneSpeed) );
			xMax += 8;
			xMin += 8;
		}
		xMin = -10, xMax = -6;
	}	
}

function initLumbers(){
	var xStartPos, laneSpeed;
	for(var i = 1; i < 8; i++){
		laneSpeed = getRandomArbitrary(0.07, 0.1);
		xStartPos = getRandomNumber(-7, -2);
		lumbers.push( new Lumber(i, xStartPos, laneSpeed) );
		xStartPos = getRandomNumber(3, 7);
		lumbers.push( new Lumber(i, xStartPos, laneSpeed) );
	}
	
}

function drawGround( mv ){
	
	//Teiknar vinningsjörðina
	gl.uniform4fv( colorLoc, RED );
	gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, numCubeVertices, 6 );
	
	
	//Teiknar vatnið
	gl.uniform4fv( colorLoc, WATERBLUE );
	gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, numCubeVertices+6, 6 );
	
	
	//Millistig
	gl.uniform4fv( colorLoc, GREEN );
	gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, numCubeVertices+12, 6 );
	
	//Teiknar götuna
	gl.uniform4fv( colorLoc, BLACK );
	gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, numCubeVertices+18, 6 );
	
	//Byrjunarjörðin
	gl.uniform4fv( colorLoc, RED );
	gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, numCubeVertices+24, 6 );
	
}
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	

    var mv = mat4();
	mv = lookAt( vec3(-25.0+frog.yPos, -frog.xPos, 12), vec3(frog.yPos, -frog.xPos, 4.0), vec3(0.0, 0.0, 1.0 ) );
	mv = mult(mv, rotateY( spinX ));
	mv = mult(mv, rotateX( spinY ));
	//Þetta rotate lagar að X ásinn virtist vera eins og Y ásinn, gætum kannski
	//lagað það og sleppt þessu en þetta virkar.
	mv = mult( mv, rotateZ( 90 ) );
	
	for(var i = 0; i<cars.length; i++){
		cars[i].draw(mv, gl);
	}
	for(var i = 0; i<lumbers.length; i++){
		lumbers[i].draw(mv, gl);
	}
	
	frog.updateMovement(cars, lumbers);
	frog.draw(mv, gl);
	
	drawGround( mv );
	//mv = mult( mv, rotateZ( -carDirection ) );
	//mv = mult( mv, translate(carXPos, carYPos, 0.0) );

	//carXPos += 0.01;
	//carYPos += 0.01;
	requestAnimFrame( render );
}
    
    
  


