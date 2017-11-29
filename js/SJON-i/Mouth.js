function Mouth(scale, x, y, type) {
  this.scale = scale;
  /* @var emotion 
   * this is the description of the current emotion,
   * used to show emotion
   */
  this.emotion = typeof type === 'undefined' ? "neutral" : type;
  /* @var factor
   * multiplication factors to scale original image before displaying
   */
  this.factor = {
    x: 0.0005 * this.scale,
    y: 0.0006 * this.scale
  };
  if(typeof x !== "undefined" && typeof y !== "undefined") {
    this.p = {
      x: x,
      y: y
    };
  }
  /* @var talkingPhase
   * keep track of which part of animation should be displayed
   */
  this.talkingPhase = 0;
}

/* @var inverseTalkingSpeed
 * determines speech animation speed
 */
Mouth.prototype.inverseTalkingSpeed = 3;

Mouth.prototype.p = {
  x: 0.5,
  y: 0.75
};

Mouth.prototype.show = function() {
  var img;
  switch(this.emotion) {
    case "neutral":
      img = Mouth.prototype.neutral;
      break;
    case "happy":
      img = Mouth.prototype.happy;
      break;
    case "thinking":
      img = Mouth.prototype.thinking;
      break;
    case "talking":
      img = Mouth.prototype.talking[this.talkingPhase];
      // update phase als er Mouth.prototype.inverseTalkingSpeed frames voorbij zijn
      this.talkingPhase = frameCount % Mouth.prototype.inverseTalkingSpeed === 0 ? 
        (this.talkingPhase + 1) % Mouth.prototype.talking.length : this.talkingPhase;
  }
  const destinationDimensions = {
    x: this.factor.x * img.width,
    y: this.factor.y * img.height
  };
  //imageMode(CENTER);
  image(img, this.p.x * this.scale, this.p.y * this.scale, destinationDimensions.x, destinationDimensions.y, 0, 0);
  if(SJON_i.prototype.debug) {
    textSize(18);
    textAlign(LEFT);
    fill(255, 0, 0);
    noStroke();
    text(this.emotion, this.p.x * this.scale - 26, this.p.y * this.scale + 15);
  }
}