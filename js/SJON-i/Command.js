function Command(parent, expression, callback, capturingPool, args) {
  this.parent = parent;
  this.e = expression;
  this.callback = callback;
  this.capturingPool = capturingPool;
  this.args = args;
}

Command.prototype.inPool = function(g) {
  var rtrnr = false;
  for(var i = 0; i < this.capturingPool.length; i++) {
    if(this.capturingPool[i] === g) {
      rtrnr = true;
      break;
    }
  }
  return rtrnr;
}

Command.prototype.matches = function(expr) {
  const match = expr.match(this.e);
  if(match !== null) {
    var rest;
    for(var i = 1; i < match.length; i++) {
      if(!this.inPool(i)) {
        // dit betekent dat het een onjuiste cpaturing group is
        continue;
      }
      if(typeof match[i] !== "undefined") {
        rest = match[i];
        break;
      }
    }
    if(SJON_i.prototype.debug) {
      console.log(match);
      console.log("Expr '" + expr + "' matched this.e '" + this.e + "'.");
    }
    if(typeof this.callback === "function") {
      this.callback(expr, rest, this.args);
    }
    return true;
  } else {
    if(SJON_i.prototype.debug) {
      console.log("Expr '" + expr + "' did not match this.e '" + this.e + "'.");
    }
    return false;
  }
}