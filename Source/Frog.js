//Get a number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function Frog( lane){	
	this.respawn();
}
Frog.prototype.respawn = function(){
	this.xPos = 0;
	this.yPos = -10;
	this.color = new vec4(0,0,1,1);
}

Frog.prototype.moveY = function(y){
	this.yPos += y;
}
Frog.prototype.moveX = function(x){
	this.xPos += x;
}


Frog.prototype.updateMovement = function(cars, lumbers){
	
	//Passa að froskur sé inná leiksvæðinu
	if(this.xPos > 10) this.xPos = 10;
	if(this.xPos < -10) this.xPos = -10;
	if(this.yPos > 10) this.yPos = 10;
	if(this.yPos < -10) this.yPos = -10;
	
	//Athuga árekstra
	if(this.checkCarCollision( cars )){
		 //Froskur dauður.
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
			this.respawn();
		}
	}
	
	if(this.yPos > 7.5){
		//Froskurinn er kominn á vinningssvæðið!
		console.log("Sigur!");
		this.respawn();
	}
	
}


Frog.prototype.checkCarCollision = function ( cars ){
	 //Bíllinn er 3x1 ferningur xLow = Xpos-1.50 ,  xHigh = Xpos+1.5 því xPos er miðjan
	 //Við erum 1x1 ferningur xLow = frogXPos-0.5, xHigh = frogXPos+0.5 því xPos er miðjan. 
	 for(var i=0; i < cars.length; i++){
		 //Fer í gegnum alla bílana
		 if( this.xPos+0.5 > cars[i].xPos-1.5 && this.xPos-0.5 < cars[i].xPos+1.5 && this.yPos == cars[i].yPos){
			 //Rekst á bíl, drepa frosk?
			 console.log("Þetta skeður þegar þú vinnur Leó Blær"); 
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
	gl.uniform4fv( colorLoc, this.color );
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cubeBuffer );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	
    
	mv = mult( mv, translate(this.xPos, this.yPos, 0.5) );//bæta inn size
	mv = mult( mv, scalem(1, 1, 1) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, numCubeVertices );
}