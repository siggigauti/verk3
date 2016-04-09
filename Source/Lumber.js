//Get a number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function Lumber( lane, xPos, speed){
	this.xPos = xPos;
	this.yPos = lane;
	//Breyta sem �kve�ur hvort b�llinn fari fr� h�gri til vinstri e�a �fugt.
	this.movingLeft = false;
	this.Color = vec4(0.6, 0.3, 0, 1.0);
	this.speed = speed;
	//Lengdin � tr�inu.
	this.lumberLength = getRandomArbitrary(2, 5);
	
	if(lane % 3 == 0){
		this.speed *= -1;
		this.movingLeft = true;
	}	
}

Lumber.prototype.updateMovement = function(){
	if(this.xPos < 12.5 && this.xPos > -12.5){
		this.xPos += this.speed;
	}
	else{
		//this.speed = getRandomArbitrary(0.15, 0.25)*0.5;
		if(this.xPos > 10){
			this.xPos = -12.49;
		}
		else{
			this.xPos = 12.49;
		}	
	}
}

Lumber.prototype.draw = function( mv, gl ){
	this.updateMovement();
	
	var materialDiffuse = vec4( 0.0, 0.5, 0.5, 1.0 );
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv( gl.getUniformLocation(program1, "diffuseProduct"), flatten(diffuseProduct) );

	gl.vertexAttribPointer( vPosition1, 4, gl.FLOAT, false, 0, 0 );
	mv = mult(mv, translate(this.xPos, this.yPos, 0.15));
	mv = mult(mv, rotateX(-90));
	if(!this.movingLeft) mv = mult(mv, rotateY(180));	
	mv = mult(mv, scalem(0.8, 0.5, 0.7));

	normalMatrix = [
        vec3(mv[0][0], mv[0][1], mv[0][2]),
        vec3(mv[1][0], mv[1][1], mv[1][2]),
        vec3(mv[2][0], mv[2][1], mv[2][2])
  ];
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mv) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
  gl.drawArrays( gl.TRIANGLES, numCarVertices+numCowVertices, numSharkVertices);
}