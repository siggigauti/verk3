//Get a number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function Frog( lane){	
	this.respawn();
	this.points = 0;
	this.lives = 3;
	this.timeAlive;
	this.fattness = 0.4;
	
}
Frog.prototype.respawn = function(){
	this.timeOfBirth = Date.now();
	this.xPos = 0;
	this.yPos = -10;
	this.color = new vec4(0,0,1,1);
	this.rotDirection = -90;
	apple.respawn();
}

Frog.prototype.moveY = function(y){
	if(y > 0) this.rotDirection = -90;
	else this.rotDirection = 90;
	this.yPos += y;
}
Frog.prototype.moveX = function(x){
	this.xPos += x;
	if(x > 0) this.rotDirection = 0;
	else this.rotDirection = 180;
}


Frog.prototype.updateMovement = function(cars, lumbers, apple){
	this.timeAlive = (Date.now() - this.timeOfBirth) / 1000;
	
	
	if(this.lives == 0){
		//Froskurinn hefur dáið þrisvar sinnum,  stig endursetjast.
		this.points = 0;
		this.lives = 3;
		this.fattness = 0.4;
	}
	if(this.timeAlive > 60){
		//Spilari er búinn að vera í 60min að leysa brautina,  þá tapar hann lífi
		this.lives--;
		this.respawn();	
	}
	
	//Passa að froskur sé inná leiksvæðinu
	if(this.xPos > 10) this.xPos = 10;
	if(this.xPos < -10) this.xPos = -10;
	if(this.yPos > 10) this.yPos = 10;
	if(this.yPos < -10) this.yPos = -10;
	
	//Athuga árekstra
	if(this.checkCarCollision( cars )){
		 //Froskur dauður.
		 this.lives--;
		 this.respawn();
	 }
	if(this.yPos > 0.5 && this.yPos < 7.5){
		 //Athuga bara lumber collision ef við erum á eða við vatnið.
		 //Það er til að við séum ekki að athuga lumber collision þegar
		 //við erum kannski á byrjunarstaðnum eða á götunni.
		 //þetta 0.5 gildi er byrjunin á ánni.
		var lumber = this.checkLumberCollision( lumbers );
		if(lumber != null){
			//Froskurinn er á tré og tréið sem hann er á er
			//isOnLumber hluturinn.
			this.xPos += lumber.speed;	 
		}
		else{
			//Við erum á vatninu og ekki á lumber sem þýðir dauður froskur.		
			this.lives--;
			this.respawn();
		}
	}
	
	if(this.yPos > 7.5){
		//Froskurinn er kominn á vinningssvæðið!
		console.log("Sigur!");
		if(this.xPos > apple.xPos-0.5 && this.xPos < apple.xPos+0.5){
			console.log("Náði epli!")
			this.points += 200;
			//Fitar beljuna aðeins
			if(this.fattness < 1.5)this.fattness += 0.25;
			
		}
		this.points += (60-this.timeAlive) * 5;
		this.respawn();
	}
	
	
	
}


Frog.prototype.checkCarCollision = function ( cars ){
	 //Bíllinn er 3x1 ferningur xLow = Xpos-1.50 ,  xHigh = Xpos+1.5 því xPos er miðjan
	 //Við erum 1x1 ferningur xLow = frogXPos-0.5, xHigh = frogXPos+0.5 því xPos er miðjan. 
	 for(var i=0; i < cars.length; i++){
		 //Fer í gegnum alla bílana
		 if( this.xPos+0.5 > cars[i].xPos-1.1 && this.xPos-0.5 < cars[i].xPos+1.1 && this.yPos == cars[i].yPos){
			 //Rekst á bíl, drepa frosk?
			 console.log("Car collision"); 
			 return true;
		 } 
	 }  
	 return false;
 }
Frog.prototype.checkLumberCollision = function( lumbers ){
	 //Bíllinn er 3x1 ferningur xLow = Xpos-1.50 ,  xHigh = Xpos+1.5 því xPos er miðjan
	 //Við erum 1x1 ferningur xLow = frogXPos-0.5, xHigh = frogXPos+0.5 því xPos er miðjan. 
	for(var i=0; i < lumbers.length; i++){
		//Fer í gegnum alla bílana
		if( (this.xPos+0.5 > lumbers[i].xPos-(lumbers[i].lumberLength/2) && this.xPos-0.5 < lumbers[i].xPos+(lumbers[i].lumberLength/2) ) && this.yPos == lumbers[i].yPos){
			//Rekst á bíl, drepa frosk?
			console.log("Lumber Collision"); 
			//Skilar tréinu sem froskurinn er á.
			return lumbers[i];
		} 
	}  
	return null;
}

Frog.prototype.draw = function( mv, gl ){
	
		
    // set color to blue
	/*gl.uniform4fv( colorLoc, this.color );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition1, 3, gl.FLOAT, false, 0, 0 );
	
    
	mv = mult( mv, translate(this.xPos, this.yPos, 0.5) );//bæta inn size
	mv = mult( mv, scalem(1, 1, 1) );
    gl.uniformMatrix4fv(mvLoc1, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
	*/
	var materialDiffuse = vec4( 0.6, 0.5, 0.0, 1.0 );
	diffuseProduct = mult(lightDiffuse, materialDiffuse);
	gl.uniform4fv( gl.getUniformLocation(program1, "diffuseProduct"), flatten(diffuseProduct) );
	gl.bindBuffer( gl.ARRAY_BUFFER, carvBuffer );
	gl.vertexAttribPointer( vPosition1, 4, gl.FLOAT, false, 0, 0 );
    //gl.enableVertexAttribArray( vPosition1 );
	mv = mult(mv, translate(this.xPos, this.yPos, 0.45));
	mv = mult(mv, rotateX(-90));
	mv = mult(mv, rotateY(this.rotDirection));
	mv = mult(mv, scalem(0.4, 0.5, this.fattness));
	normalMatrix = [
        vec3(mv[0][0], mv[0][1], mv[0][2]),
        vec3(mv[1][0], mv[1][1], mv[1][2]),
        vec3(mv[2][0], mv[2][1], mv[2][2])
    ];
      gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mv) );
      gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
      gl.drawArrays( gl.TRIANGLES, numCarVertices, numCowVertices);
}