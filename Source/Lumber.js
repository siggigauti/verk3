//Get a number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function Lumber( lane, xPos, speed){
	
	this.xPos = xPos;
	this.yPos = lane;
	//Breyta sem ákveður hvort bíllinn fari frá hægri til vinstri eða öfugt.
	this.movingLeft = false;
	this.Color = vec4(0.6, 0.3, 0, 1.0);
	this.speed = speed;
	//Lengdin á tréinu.
	this.lumberLength = getRandomArbitrary(2, 5);
	
	if(lane % 3 == 0){
		this.speed *= -1;
	}
	
}
Lumber.prototype.updateMovement = function(){
	
	if(this.xPos < 10 && this.xPos > -10){
		this.xPos += this.speed;
	}
	else{
		//this.speed = getRandomArbitrary(0.15, 0.25)*0.5;
		if(this.xPos > 10){
			this.xPos = -9.99;
		}
		else{
			this.xPos = 9.99;
		}	
	}
}

Lumber.prototype.draw = function( mv, gl ){
	
	this.updateMovement();
	
	gl.uniform4fv( colorLoc, this.Color );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

	mv = mult(mv, translate(this.xPos, this.yPos, 0.0));

    mv = mult( mv, scalem( this.lumberLength, 1, 0.05 ) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

}