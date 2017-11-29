function Eye(scale, x, y, type) {
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
    x: 0.00042 * this.scale,
    y: 0.00042 * this.scale
  };
  if(typeof x !== "undefined" && typeof y !== "undefined") {
    this.p = {
      x: x,
      y: y
    };
  }
}

Eye.prototype.p = {
  x: 0.3,
  y: 0.25
};

Eye.prototype.show = function() {
  var img;
  switch(this.emotion) {
    case "neutral":
      img = Eye.prototype.neutral;
      break;
    case "happy":
      img = Eye.prototype.happy;
      break;
    case "thinking":
      img = Eye.prototype.thinking;
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
    text(this.emotion, this.p.x * this.scale - 26, this.p.y * this.scale);
  }
}