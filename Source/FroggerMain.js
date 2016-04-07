
var canvas;
var gl;
var YELLOW = vec4(1.0, 1.0, 0.0, 1.0);
var BLUE = vec4(0.0, 0.0, 1.0, 1.0);
var RED = vec4(1.0, 0.0, 0.0, 1.0);
var GRAY = vec4(0.4, 0.4, 0.4, 1.0);
var BLACK = vec4(0, 0, 0, 1.0);
var GREEN = vec4(0, 0.6, 0, 1.0);
var WATERBLUE = vec4(0.5294117647, 0.80784313725, 0.98, 1.0);
var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;
var numCubeVertices  = 36;
var htmlPoints, htmlLives, htmlTime;



var height = 0.0;
var turn = 0.0;

var program1;
var program2;

var frog;
var points;
var roundStartTimer, roundEndTimer;
var cars = [];
var lumbers = [];
var numCarsPerLane = 2;

var locTexCoord;
var colorLoc;
var mvLoc1;
var pLoc1;
var proj;
var mvLoc2;
var pLoc2;


var cubeBuffer;
var earthBuffer;
var trackBuffer;
var vPosition1;
var vPosition2;


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
    vec3( -0.5, -0.5,  0.5 ), vec3( -0.5,  0.5,  0.5 ), vec3( -0.5,  0.5, -0.5 )
	
	//J�r�in byrjar � 36
	
	
];

var earthCoords = [
  //Vinningssv��i� er 3x21 ferningur
  vec4(10.5, 10.5, 0, 1.0),
  vec4(-10.5, 10.5, 0, 1.0),
  vec4(-10.5, 7.5, 0, 1.0),
  vec4(10.5, 10.5, 0, 1.0),
  vec4(10.5, 7.5, 0, 1.0), 
  vec4(-10.5, 7.5, 0, 1.0),
  
  //�in er 7x21 ferningur
  vec4(10.5, 7.5, 0, 1.0), vec4(-10.5, 7.5, 0, 1.0), vec4(-10.5, 0.5, 0, 1.0),
  vec4(10.5, 7.5, 0, 1.0), vec4(10.5, 0.5, 0, 1.0), vec4(-10.5, 0.5, 0, 1.0),
  
  //Mi�jusv��i er 2x21 ferningur
  vec4(10.5, 0.5, 0, 1.0), vec4(-10.5, 0.5, 0, 1.0), vec4(-10.5, -1.5, 0, 1.0),
  vec4(10.5, 0.5, 0, 1.0), vec4(10.5, -1.5, 0, 1.0), vec4(-10.5, -1.5, 0, 1.0),
  
  //Gatan er 7x21 ferningur
  vec4(10.5, -1.5, 0, 1.0), vec4(-10.5,  -1.5, 0, 1.0), vec4(-10.5, -7.5, 0, 1.0),
  vec4(10.5, -1.5, 0, 1.0), vec4(10.5, -7.5, 0, 1.0), vec4(-10.5, -7.5, 0, 1.0),
  
  //Byrjunarsv��i� er 2x21 ferningur
  vec4(10.5, -7.5, 0, 1.0), vec4(-10.5, -7.5, 0, 1.0), vec4(-10.5, -10.5, 0, 1.0),
  vec4(10.5, -7.5, 0, 1.0), vec4(10.5, -10.5, 0, 1.0), vec4(-10.5, -10.5, 0, 1.0),


  // front side:
    vec4( -0.5,  0.5,  0.5, 1.0 ), vec4( -0.5, -0.5,  0.5, 1.0 ), vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ), vec4(  0.5,  0.5,  0.5, 1.0 ), vec4( -0.5,  0.5,  0.5, 1.0 ),
    // right side:
    vec4(  0.5,  0.5,  0.5, 1.0 ), vec4(  0.5, -0.5,  0.5, 1.0 ), vec4(  0.5, -0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 ), vec4(  0.5,  0.5, -0.5, 1.0 ), vec4(  0.5,  0.5,  0.5, 1.0 ),
    // bottom side:
    vec4(  0.5, -0.5,  0.5, 1.0 ), vec4( -0.5, -0.5,  0.5, 1.0 ), vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ), vec4(  0.5, -0.5, -0.5, 1.0 ), vec4(  0.5, -0.5,  0.5, 1.0 ),
    // top side:
    vec4(  0.5,  0.5, -0.5, 1.0 ), vec4( -0.5,  0.5, -0.5, 1.0 ), vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ), vec4(  0.5,  0.5,  0.5, 1.0 ), vec4(  0.5,  0.5, -0.5, 1.0 ),
    // back side:
    vec4( -0.5, -0.5, -0.5, 1.0 ), vec4( -0.5,  0.5, -0.5, 1.0 ), vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ), vec4(  0.5, -0.5, -0.5, 1.0 ), vec4( -0.5, -0.5, -0.5, 1.0 ),
    // left side:
    vec4( -0.5,  0.5, -0.5, 1.0 ), vec4( -0.5, -0.5, -0.5, 1.0 ), vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5,  0.5, 1.0 ), vec4( -0.5,  0.5,  0.5, 1.0 ), vec4( -0.5,  0.5, -0.5, 1.0 )

];

// Mynsturhnit fyrir spjaldi�
var texCoords = [
	//Vinningssv��i
    vec2( 21.0, 3.0 ),
    vec2( 0.0, 3.0 ),
    vec2( 0.0, 0.0 ),
    vec2( 21.0, 3.0 ),
    vec2( 21.0, 0.0 ),
    vec2( 0.0, 0.0 ),
	
	//Vatn
	vec2( 21.0, 7.0 ),
    vec2( 0.0, 7.0 ),
    vec2( 0.0, 0.0 ),
    vec2( 21.0, 7.0 ),
    vec2( 21.0, 0.0 ),
    vec2( 0.0, 0.0 ),
	
	//Mi�jan
	vec2( 21.0, 2.0 ),
    vec2( 0.0, 2.0 ),
    vec2( 0.0, 0.0 ),
    vec2( 21.0, 2.0 ),
    vec2( 21.0, 0.0 ),
    vec2( 0.0, 0.0 ),
	
	//Gatan
	vec2( 21.0, 7.0 ),
    vec2( 0.0, 7.0 ),
    vec2( 0.0, 0.0 ),
    vec2( 21.0, 7.0 ),
    vec2( 21.0, 0.0 ),
    vec2( 0.0, 0.0 ),
	
	//Byrjunarsv��i
	vec2( 21.0, 2.0 ),
    vec2( 0.0, 2.0 ),
    vec2( 0.0, 0.0 ),
    vec2( 21.0, 2.0 ),
    vec2( 21.0, 0.0 ),
    vec2( 0.0, 0.0 ),

  //Himinn
  vec2( 0.0, 35.0 ), vec2( 0.0, 0.0 ), vec2( 35.0, 0.0 ), vec2( 35.0, 0.0 ), vec2( 35.0, 35.0 ), vec2( 35.0, 0.0 ), //front
  vec2( 35.0, 35.0 ), vec2( 35.0, 0.0 ), vec2( 35.0, 0.0 ), vec2( 35.0, 0.0 ), vec2( 35.0, 35.0 ), vec2( 35.0, 35.0 ), //right
  vec2( 35.0, 0.0 ), vec2( 0.0, 0.0 ), vec2( 0.0, 0.0 ), vec2( 0.0, 0.0 ), vec2( 35.0, 0.0 ), vec2( 35.0, 0.0 ), //bottom
  vec2( 35.0, 35.0 ), vec2( 0.0, 35.0 ), vec2( 0.0, 35.0 ), vec2( 0.0, 35.0 ), vec2( 35.0, 35.0 ), vec2( 35.0, 35.0 ), //up
  vec2( 0.0, 0.0 ), vec2( 0.0, 35.0 ), vec2( 35.0, 35.0 ), vec2( 35.0, 35.0 ), vec2( 35.0, 0.0 ), vec2( 0.0, 0.0 ), //back
  vec2( 0.0, 35.0 ), vec2( 0.0, 0.0 ), vec2( 0.0, 0.0 ), vec2( 0.0, 0.0 ), vec2( 0.0, 35.0 ), vec2( 0.0, 35.0 ), //left
];

// vertices of the track
var tVertices = [];


var xMovement = 0;
var yMovement = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
	
	initCars();
	initLumbers();	
	frog = new Frog();
	htmlLives = document.getElementById( "livesLeft" );
	htmlPoints = document.getElementById( "points" );
	htmlTimeLeft = document.getElementById( "timeLeft" );
	
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 1.0, 0.7, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);


    //<------Uniform color program og location binders----------->
    // Litarar sem lite me� einum lit (uniform)
    program1 = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program1 ); //Hva�a program � a� nota?

    //Buffer fyrir �ll hnitin.
    cubeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cVertices), gl.STATIC_DRAW );

    //vPosition fyrir program1
    vPosition1 = gl.getAttribLocation( program1, "vPosition" );
    gl.vertexAttribPointer( vPosition1, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition1 );

    colorLoc = gl.getUniformLocation( program1, "fColor" );

    //ModelViewLoc fyrir program1
    mvLoc1 = gl.getUniformLocation( program1, "modelview" );
    //ProjectionLoc fyrir program1
    pLoc1 = gl.getUniformLocation( program1, "projection" );

    //SKO�A DRAW F�LLIN, PASSA A� R�TT vPosition s� nota� (1 e�a 2) SAMA ME� mvLoc

    //<------Texture program og location binders----------->
    // Litarar sem lita me� mynstri (texture)
    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );

    earthBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, earthBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(earthCoords), gl.STATIC_DRAW );

    //Muna a� skipta myndunum me� configureTexture( image, program2 ); 
    //�ar sem image er var image = document.getElementById("id � image")
    vPosition2 = gl.getAttribLocation( program2, "vPosition" );
    gl.enableVertexAttribArray( vPosition2 );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );

    locTexCoord = gl.getAttribLocation( program2, "vTexCoord" );
    gl.vertexAttribPointer( locTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( locTexCoord );

    mvLoc2 = gl.getUniformLocation( program2, "modelview" );
    //ProjectionLoc fyrir program2
    pLoc2 = gl.getUniformLocation( program2, "projection" );

    gl.enable( gl.MULTISAMPLE );

    //<----Setjum projection � progr�min---->
    proj = perspective( 50.0, 1.0, 1.0, 500.0 );
    gl.useProgram(program1);
    gl.uniformMatrix4fv(pLoc1, false, flatten(proj));
    
    gl.useProgram(program2);
    gl.uniformMatrix4fv(pLoc2, false, flatten(proj));

    //Textures ekki implementa� strax, notum program1
    gl.useProgram(program1);
            
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
	
	
	window.setInterval(render, 17);
}
function updateHtmlText(){
	htmlPoints.innerHTML = Math.round(frog.points)+" Points";
	htmlLives.innerHTML = frog.lives+" Lives left";
	htmlTimeLeft.innerHTML = Math.round(60-frog.timeAlive) + " Seconds remaining";
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
	
	//Teiknar vinningsj�r�ina
	//gl.uniform4fv( colorLoc, RED );
	var image = document.getElementById("texImage");
	//Textures sem vi� notum:
	var water = document.getElementById("waterImage");
	var grass = document.getElementById("grassImage");
	var concrete = document.getElementById("concreteImage");
	configureTexture(grass, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 0, 6 );
	
	
	//Teiknar vatni�
	//gl.uniform4fv( colorLoc, WATERBLUE );
	configureTexture(water, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 6, 6 );
	
	
	//Millistig
	//gl.uniform4fv( colorLoc, GREEN );
	configureTexture(grass, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 12, 6 );

	//Teiknar g�tuna
	//gl.uniform4fv( colorLoc, BLACK );
	configureTexture(concrete, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 18, 6 );
	
	//Byrjunarj�r�in
	//gl.uniform4fv( colorLoc, RED );
	configureTexture(grass, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 24, 6 );
	
}

function drawSky( mv ){
  //gl.uniform4fv( colorLoc, WATERBLUE );
  mv = mult(mv, scalem(80.0, 80.0, 80.0) );
  //texture
  var water1 = document.getElementById("waterImage");
  configureTexture(water1, program2);
  gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
  gl.drawArrays( gl.TRIANGLES, 30, numCubeVertices );  
}

function render()
{
	updateHtmlText();
	
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	

  var mv = mat4();
	mv = lookAt( vec3(-25.0+frog.yPos, -frog.xPos, 12.0), vec3(frog.yPos, -frog.xPos, 4.0), vec3(0.0, 0.0, 1.0 ) );
	mv = mult(mv, rotateY( spinX ));
	mv = mult(mv, rotateX( spinY ));
	//�etta rotate lagar a� X �sinn virtist vera eins og Y �sinn, g�tum kannski
	//laga� �a� og sleppt �essu en �etta virkar.
	mv = mult( mv, rotateZ( 90 ) );
	
  gl.useProgram(program1);
  gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
  gl.vertexAttribPointer( pLoc1, 3, gl.FLOAT, false, 0, 0 );
	for(var i = 0; i<cars.length; i++){
		cars[i].draw(mv, gl);
	}
	for(var i = 0; i<lumbers.length; i++){
		lumbers[i].draw(mv, gl);
	}
	
	frog.updateMovement(cars, lumbers);
	frog.draw(mv, gl);
  

	gl.useProgram(program2);
  gl.bindBuffer( gl.ARRAY_BUFFER, earthBuffer );
  gl.vertexAttribPointer( pLoc2, 4, gl.FLOAT, false, 0, 0 );
	drawGround( mv );
  drawSky( mv );
	//mv = mult( mv, rotateZ( -carDirection ) );
	//mv = mult( mv, translate(carXPos, carYPos, 0.0) );

	//carXPos += 0.01;
	//carYPos += 0.01;
	
}
    
    

function configureTexture( image, prog ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
}  


