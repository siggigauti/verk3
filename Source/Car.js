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
		this.movingLeft = true;
	}
}

Car.prototype.updateMovement = function(){
	if(this.xPos < 12.0 && this.xPos > -12.0){
		this.xPos += this.speed;
	}
	else{		
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

	var materialDiffuse = vec4( this.color, 1.0 );
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv( gl.getUniformLocation(program1, "diffuseProduct"), flatten(diffuseProduct) );

	mv = mult(mv, translate(this.xPos, this.yPos, 0.4));
	mv = mult(mv, rotateX(-90));
	if(this.movingLeft) mv = mult(mv, rotateY(180));	
	mv = mult(mv, scalem(0.4, 0.4, 0.4));

	normalMatrix = [
        vec3(mv[0][0], mv[0][1], mv[0][2]),
        vec3(mv[1][0], mv[1][1], mv[1][2]),
        vec3(mv[2][0], mv[2][1], mv[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mv) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
  gl.drawArrays( gl.TRIANGLES, 0, numCarVertices);
}
