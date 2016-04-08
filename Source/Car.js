//Get a number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function Car( lane, xPos, speed){
	
	this.xPos = xPos;
	this.yPos = lane;
	//Breyta sem ákveður hvort bíllinn fari frá hægri til vinstri eða öfugt.
	this.movingLeft = false;
	this.color = vec4(Math.random(), Math.random(), Math.random(), 1.0);
	this.roofColor = vec4(Math.random(), Math.random(), Math.random(), 1.0);
	this.speed = speed;
	
	if(lane % 2 == 0){
		this.speed *= -1;
	}
	
}
Car.prototype.updateMovement = function(){
	
	if(this.xPos < 12.0 && this.xPos > -12.0){
		this.xPos += this.speed;
	}
	else{
		//this.speed = getRandomArbitrary(0.15, 0.25)*0.5;
		
		if(this.xPos > 10){
			this.xPos = -11.99;
		}
		else{
			this.xPos = 11.99;
		}	
	}
}

Car.prototype.draw = function( mv, gl ){
	

	this.updateMovement();
	
	gl.uniform4fv( colorLoc, this.color );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition1, 3, gl.FLOAT, false, 0, 0 );

	mv = mult(mv, translate(this.xPos, this.yPos, 0.0));

    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( 3.0, 1.0, 0.8 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( 1.0, 0.5, 1 ) );
    mv1 = mult( mv1, translate( -0.2, 0.0, 1 ) );
	gl.uniform4fv( colorLoc, this.roofColor );
    gl.uniformMatrix4fv(mvLoc1, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );	
}