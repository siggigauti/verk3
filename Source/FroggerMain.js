
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
// variables for moving car
var carDirection = 0.0;
var frogXPos = 0.0;
var frogYPos = -10.0;

var carXPos = 0.0;
var carYPos = 0.0;

var height = 0.0;
var turn = 0.0;


var cars = [];
var lumbers = [];

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
	vec3(10, 10, 0), vec3(-10, 10, 0), vec3(-10, 8, 0),
	vec3(10, 10, 0), vec3(10, 8, 0), vec3(-10, 8, 0),
	
	//Áin er 7x10 ferningur
	vec3(10, 8, 0), vec3(-10, 8, 0), vec3(-10, 0.5, 0),
	vec3(10, 8, 0), vec3(10, 0.5, 0), vec3(-10, 0.5, 0),
	
	//Miðjusvæði er 2x10 ferningur
	vec3(10, 0.5, 0), vec3(-10, 0.5, 0), vec3(-10, -1, 0),
	vec3(10, 0.5, 0), vec3(10, -1, 0), vec3(-10, -1, 0),
	
	//Gatan er 7x10 ferningur
	vec3(10, -1, 0), vec3(-10, -1, 0), vec3(-10, -8, 0),
	vec3(10, -1, 0), vec3(10, -8, 0), vec3(-10, -8, 0),
	
	//Byrjunarsvæðið er 2x10 ferningur
	vec3(10, -8, 0), vec3(-10, -8, 0), vec3(-10, -10, 0),
	vec3(10, -8, 0), vec3(10, -10, 0), vec3(-10, -10, 0),
];

// vertices of the track
var tVertices = [];


var xMovement = 0;
var yMovement = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
	
		
		cars.push(new Car(-7));
		cars.push(new Car(-5));
		cars.push(new Car(-4));
		cars.push(new Car(-2));
		lumbers.push(new Lumber(1));
		lumbers.push(new Lumber(2));
		lumbers.push(new Lumber(3));
		lumbers.push(new Lumber(4));
		lumbers.push(new Lumber(5));
		lumbers.push(new Lumber(6));
		lumbers.push(new Lumber(7));
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.7, 1.0, 0.7, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // VBO for the cube
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
                frogYPos += 1;
                break;
            case 83:	// S
                frogYPos -= 1;
                break;
			case 68:	// D
				frogXPos += 1;
				break;
			case 65:	// A
				frogXPos -= 1;
				break;
		}
	} );
    render();
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
// 
function drawCube( mv ) {

    // set color to blue
    gl.uniform4fv( colorLoc, BLUE );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    var mv1 = mv;
    
	mv = mult( mv, translate(frogXPos, frogYPos, 0.5) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

 
}
 //Gætum sett þessi föll í annan klasa eða í klasa fyrir froskinn?
function checkCarCollision(){
	 //Bíllinn er 3x1 ferningur xLow = Xpos-1.50 ,  xHigh = Xpos+1.5 því xPos er miðjan
	 //Við erum 1x1 ferningur xLow = frogXPos-0.5, xHigh = frogXPos+0.5 því xPos er miðjan. 
	 for(var i=0; i < cars.length; i++){
		 //Fer í gegnum alla bílana
		 if( frogXPos-0.5 > cars[i].xPos-1.5 && frogXPos+0.5 < cars[i].xPos+1.5 && frogYPos == cars[i].yPos){
			 //Rekst á bíl, drepa frosk?
			 console.log("Car Collision"); 
			 return true;
		 } 
	 }  
	 return false;
 }
 function checkLumberCollision(){
	 //Bíllinn er 3x1 ferningur xLow = Xpos-1.50 ,  xHigh = Xpos+1.5 því xPos er miðjan
	 //Við erum 1x1 ferningur xLow = frogXPos-0.5, xHigh = frogXPos+0.5 því xPos er miðjan. 
	 for(var i=0; i < lumbers.length; i++){
		 //Fer í gegnum alla bílana
		 if( (frogXPos-0.5 > lumbers[i].xPos-1.5 && frogXPos+0.5 < lumbers[i].xPos+1.5) && frogYPos == lumbers[i].yPos){
			 //Rekst á bíl, drepa frosk?
			 console.log("Lumber Collision"); 
			 //Skilar tréinu sem froskurinn er á.
			 return lumbers[i];
		 } 
	 }  
	 return null;
 }
 function updateMovement(){
	 if(checkCarCollision()){
		 //Froskur dauður.
		 respawnFrog();
	 }
	 if(frogYPos > 0.5){
		 //Athuga bara lumber collision ef við erum á eða við vatnið.
		 //Það er til að við séum ekki að athuga lumber collision þegar
		 //við erum kannski á byrjunarstaðnum eða á götunni.
		 //þetta 0.5 gildi er byrjunin á ánni.
		var lumber = checkLumberCollision();
		if(lumber != null){
			//Froskurinn er á tré og tréið sem hann er á er
			//isOnLumber hluturinn.
			frogXPos += lumber.speed;	 
		}
		else{
			//Við erum á vatninu og ekki á lumber sem þýðir dauður froskur.
			respawnFrog();
		}
	 }

	 
 }
 function respawnFrog(){
	 frogXPos = 0;
	 frogYPos = -10;	 
 }
 

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	updateMovement();
    var mv = mat4();
	mv = lookAt( vec3(-25.0+frogYPos, -frogXPos, 12), vec3(frogYPos, -frogXPos, 4.0), vec3(0.0, 0.0, 1.0 ) );
	mv = mult(mv, rotateY( spinX ));
	mv = mult(mv, rotateX( spinY ));
	//Þetta rotate lagar að X ásinn virtist vera eins og Y ásinn, gætum kannski
	//lagað það og sleppt þessu en þetta virkar.
	mv = mult( mv, rotateZ( 90 ) );
	
	drawCube( mv );
	for(var i = 0; i<cars.length; i++){
		cars[i].draw(mv, gl);
	}
	for(var i = 0; i<lumbers.length; i++){
		lumbers[i].draw(mv, gl);
	}
	
	drawGround( mv );
	//mv = mult( mv, rotateZ( -carDirection ) );
	//mv = mult( mv, translate(carXPos, carYPos, 0.0) );

	//carXPos += 0.01;
	//carYPos += 0.01;
	requestAnimFrame( render );
}
    
    
  


