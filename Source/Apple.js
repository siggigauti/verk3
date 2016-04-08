//Get a number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function Apple(){
	this.yPos = 9;
	this.xPos = getRandomArbitrary(-10, 10);
}

Apple.prototype.respawn = function(){
	this.xPos = getRandomArbitrary(-10, 10);
}

Apple.prototype.draw = function( mv, gl ){
	
	var materialDiffuse = vec4( 1.0, 0.1, 0.0, 1.0 );
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv( gl.getUniformLocation(program1, "diffuseProduct"), flatten(diffuseProduct) );

	gl.bindBuffer( gl.ARRAY_BUFFER, carvBuffer );
	gl.vertexAttribPointer( vPosition1, 4, gl.FLOAT, false, 0, 0 );
	mv = mult(mv, translate(this.xPos, this.yPos, 0.4));
	mv = mult(mv, rotateX(-90));
	
	mv = mult(mv, scalem(0.4, 0.4, 0.4));
	normalMatrix = [
        vec3(mv[0][0], mv[0][1], mv[0][2]),
        vec3(mv[1][0], mv[1][1], mv[1][2]),
        vec3(mv[2][0], mv[2][1], mv[2][2])
    ];
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mv) );
      gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
      gl.drawArrays( gl.TRIANGLES, numCarVertices+numCowVertices+numSharkVertices, numAppleVertices);
	
}