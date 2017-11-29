function Face(size) {
  /* @var scale
   * dit zorgt ervoor dat het gezicht er op vershcillende schermen
   * goed uitziet. Gebasseerd op de breedte en hoogte van het scherm
   */
  this.scale = size;
  // om cputijd te besparen wordt dit maar 1x gecalled. is eigenlijk beter om voor elke show() te doen.
  imageMode(CENTER);
  /* De ogen en de mond kunnen beter als 
   * aparte objecten worden bijgehouden.
   */
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