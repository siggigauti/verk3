var canvas;
var gl;
var numCubeVertices  = 36;
var htmlPoints, htmlLives, htmlTime;

var program1;
var program2;

var frog;
var points;
var roundStartTimer, roundEndTimer;
var cars = [];
var lumbers = [];
var numCarsPerLane = 2;
var numCarVertices,numCowVertices,numSharkVertices,numAppleVertices;
var numCarNormals,numCowNormals,numSharkNormals,numAppleNormals;

var offsetLoc;
var locTexCoord;
var colorLoc;
var mvLoc1;
var proj;
var mvLoc2;
var pLoc2;

var carvBuffer;
var carBuffer;
var carvNormal;
var vertices = [];
var normals = [];

var earthBuffer;
var vPosition1;
var vPosition2;
var tBuffer;

//Phong dót
var lightPosition = vec4(4.0, 4.0, 4.0, 0.0 );
var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.2, 0.0, 0.2, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;


var earthCoords = [
  //Vinningssvæðið er 2x10 ferningur
  vec4(10.5, 10.5, 0, 1.0),
  vec4(-10.5, 10.5, 0, 1.0),
  vec4(-10.5, 7.5, 0, 1.0),
  vec4(10.5, 10.5, 0, 1.0),
  vec4(10.5, 7.5, 0, 1.0), 
  vec4(-10.5, 7.5, 0, 1.0),
  
  //Áin er 7x10 ferningur
  vec4(10.5, 7.5, 0, 1.0), vec4(-10.5, 7.5, 0, 1.0), vec4(-10.5, 0.5, 0, 1.0),
  vec4(10.5, 7.5, 0, 1.0), vec4(10.5, 0.5, 0, 1.0), vec4(-10.5, 0.5, 0, 1.0),
  
  //Miðjusvæði er 2x10 ferningur
  vec4(10.5, 0.5, 0, 1.0), vec4(-10.5, 0.5, 0, 1.0), vec4(-10.5, -1.5, 0, 1.0),
  vec4(10.5, 0.5, 0, 1.0), vec4(10.5, -1.5, 0, 1.0), vec4(-10.5, -1.5, 0, 1.0),
  
  //Gatan er 7x10 ferningur
  vec4(10.5, -1.5, 0, 1.0), vec4(-10.5,  -1.5, 0, 1.0), vec4(-10.5, -7.5, 0, 1.0),
  vec4(10.5, -1.5, 0, 1.0), vec4(10.5, -7.5, 0, 1.0), vec4(-10.5, -7.5, 0, 1.0),
  
  //Byrjunarsvæðið er 2x10 ferningur
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

// Mynsturhnit fyrir spjaldið
var texCoords = [
	//Vinningssvi
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
  //Mijan
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
  //Byrjunarsvi
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

window.onload = function init() {
  canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );

	var PR = PlyReader();
	var plyData = PR.read("bill.ply");
	vertices = plyData.points;
	normals = plyData.normals;
	numCarVertices = plyData.points.length;
	
	plyData = PR.read("cow.ply");
	vertices = vertices.concat(plyData.points);
	normals = normals.concat(plyData.normals);
	numCowVertices = plyData.points.length;
	numCowNormals = plyData.normals.length;
	
	plyData = PR.read("hakarl.ply");
	vertices = vertices.concat(plyData.points);
	normals = normals.concat(plyData.normals);
	numSharkVertices = plyData.points.length;
	numSharkNormals = plyData.normals.length;
	
	plyData = PR.read("apple.ply");
	vertices = vertices.concat(plyData.points);
	normals = normals.concat(plyData.normals);
	numAppleVertices = plyData.points.length;
	numAppleNormals = plyData.normals.length;
	
	initCars();
	initLumbers();	
	apple = new Apple();
	frog = new Frog();
	htmlLives = document.getElementById( "livesLeft" );
	htmlPoints = document.getElementById( "points" );
	htmlTimeLeft = document.getElementById( "timeLeft" );

	ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);

  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.7, 1.0, 0.7, 1.0 );
    
  gl.enable(gl.DEPTH_TEST);

  //<------Uniform color program og location binders----------->
  // Litarar sem lite með einum lit (uniform)
  program1 = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program1 ); //Hvaða program á að nota?

	//Bílabuffer og dót
	carBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, carBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
	carvNormal = gl.getAttribLocation( program1, "vNormal" );
  gl.vertexAttribPointer( carvNormal, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( carvNormal );
  carvBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, carvBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

  //vPosition fyrir program1
  vPosition1 = gl.getAttribLocation( program1, "vPosition" );
  gl.vertexAttribPointer( vPosition1, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition1 );

  colorLoc = gl.getUniformLocation( program1, "fColor" );

  modelViewMatrixLoc = gl.getUniformLocation( program1, "modelViewMatrix" );
  projectionMatrixLoc = gl.getUniformLocation( program1, "projectionMatrix" );
  normalMatrixLoc = gl.getUniformLocation( program1, "normalMatrix" );
	offsetLoc = gl.getUniformLocation(program1, "offset");

  //<------Texture program og location binders----------->
  // Litarar sem lita með mynstri (texture)
  program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );
	gl.useProgram(program2);
  earthBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, earthBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(earthCoords), gl.STATIC_DRAW );

  vPosition2 = gl.getAttribLocation( program2, "vPosition" );
  gl.enableVertexAttribArray( vPosition2 );
    
  tBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );

  mvLoc2 = gl.getUniformLocation( program2, "modelview" );
  //ProjectionLoc fyrir program2
  pLoc2 = gl.getUniformLocation( program2, "projection" );

  gl.enable( gl.MULTISAMPLE );

  //<----Setjum projection á progrömin---->
  proj = perspective( 50.0, 1.0, 1.0, 500.0 );
  gl.useProgram(program1);
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(proj));
    
  gl.useProgram(program2);
  gl.uniformMatrix4fv(pLoc2, false, flatten(proj));
	
  gl.useProgram(program1);
  gl.uniform4fv( gl.getUniformLocation(program1, "ambientProduct"), flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program1, "diffuseProduct"), flatten(diffuseProduct) );
  gl.uniform4fv( gl.getUniformLocation(program1, "specularProduct"), flatten(specularProduct) );
  gl.uniform4fv( gl.getUniformLocation(program1, "lightPosition"), flatten(lightPosition) );
  gl.uniform1f( gl.getUniformLocation(program1, "shininess"), materialShininess );
        
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
	});
	
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
		laneSpeed = getRandomArbitrary(0.05, 0.08);
		xStartPos = getRandomNumber(-7, -2);
		lumbers.push( new Lumber(i, xStartPos, laneSpeed) );
		xStartPos = getRandomNumber(3, 7);
		lumbers.push( new Lumber(i, xStartPos, laneSpeed) );
	}
}

function drawGround( mv ){
	//Textures sem við notum:
	var water = document.getElementById("waterImage");
	var grass = document.getElementById("grassImage");
	var concrete = document.getElementById("concreteImage");
	configureTexture(grass, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 0, 6 );
	
	configureTexture(water, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 6, 6 );
		
	configureTexture(grass, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 12, 6 );

	configureTexture(concrete, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 18, 6 );
	
	configureTexture(grass, program2);
	gl.uniformMatrix4fv(mvLoc2, false, flatten(mv));
	gl.drawArrays( gl.TRIANGLES, 24, 6 );
}

function drawSky( mv ){
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
	
	var mv = lookAt( vec3(-10.0+frog.yPos, -frog.xPos, 14.0), vec3(frog.yPos, -frog.xPos, 4.0), vec3(0.0, 0.0, 1.0 ) );
	mv = mult( mv, rotateZ( 90 ) );
	
	gl.useProgram(program1);
	gl.uniform1f( offsetLoc, frog.xPos );
	gl.bindBuffer( gl.ARRAY_BUFFER, carvBuffer );
	gl.vertexAttribPointer( vPosition1, 4, gl.FLOAT, false, 0, 0 );
	for(var i = 0; i<cars.length; i++){
		cars[i].draw(mv, gl);
	}
	for(var i = 0; i<lumbers.length; i++){
		lumbers[i].draw(mv, gl);
	}
	apple.draw(mv, gl);
	frog.updateMovement(cars, lumbers, apple);
	frog.draw(mv, gl);
  
	gl.useProgram(program2);
	gl.bindBuffer( gl.ARRAY_BUFFER, earthBuffer );
	gl.vertexAttribPointer( pLoc2, 4, gl.FLOAT, false, 0, 0 );
	drawGround( mv );
	drawSky( mv );
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


