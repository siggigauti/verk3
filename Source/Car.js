function Car( lane){
	
	this.xPos = Math.random() * 9;
	this.yPos = lane;
	//Breyta sem ákveður hvort bíllinn fari frá hægri til vinstri eða öfugt.
	this.movingLeft = false;
	this.Color = vec4(Math.random(), Math.random(), Math.random(), 1.0);
	this.speed = Math.random() * 0.2;
}
Car.prototype.updateMovement = function(){
	
	if(this.xPos < 10){
		this.xPos += this.speed;
	}
	else{
		this.xPos = -10;
	}
}

Car.prototype.draw = function( mv, gl ){
	
	this.updateMovement();
	
	gl.uniform4fv( colorLoc, this.Color );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

	mv = mult(mv, translate(this.xPos, this.yPos, 0.0));
	mv = mult(mv, scalem(0.2, 0.2, 0.2));
    var mv1 = mv;
    // lower body of the car
    mv = mult( mv, scalem( 10.0, 3.0, 2.0 ) );
    mv = mult( mv, translate( 0.0, 0.0, 0.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );

    // upper part of the car
    mv1 = mult( mv1, scalem( 4.0, 3.0, 2.0 ) );
    mv1 = mult( mv1, translate( -0.2, 0.0, 1.5 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );	
}