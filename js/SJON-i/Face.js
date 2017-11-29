function Face(size) {
  /* @var scale
   * scale the face to look good on different screen sizes
   * based on screen width and height
   */
  this.scale = size;
  // called once instead of every draw cycle as micro optimization
  imageMode(CENTER);
  // keep track of eyes and mouth as different objects
  this.eyes = [
    new Eye(this.scale, 0.32, 0.28),
    new Eye(this.scale, 0.68, 0.28)
  ];
  this.mouth = new Mouth(this.scale);
}

Face.prototype.update = function() {
  //this.emotions[this.emotion].update();
}

Face.prototype.show = function() {
  for(var i = 0; i < this.eyes.length; i++) {
    this.eyes[i].show(this.scale);
  }
  this.mouth.show();
  if(SJON_i.prototype.debug) {
    noFill();
    stroke(255, 0, 0);
    rect(0, 0, this.scale - 1, this.scale - 1);
  }
}