function Action(sjoniInstance, cycle, callback, duration, creation, eyeIndex) {
  this.ancestor = sjoniInstance;
  this.cycle = cycle;
  this.callback = callback;
  this.frameDuration = typeof duration === "undefined" ? 30 : duration;
  this.creationFrame = typeof creation === "undefined" ? frameCount : creation;
  this.eyeIndex = eyeIndex;
}

Action.prototype.run = function() {
  const endFrame = this.creationFrame + this.frameDuration;
  if(endFrame <= frameCount) {
    // marked for deletion
    this.callback();
    return true;
  } else {
    // still valid
    this.cycle();
  }
}