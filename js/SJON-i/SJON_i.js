function SJON_i() {
  this.answerHandler = function() {
    
  }
  /* @const size
   * how big should face be?
   */
  const size = Math.min(width, height);
  this.speaking = false;
  /* @var face
   * manages face
   */
  this.face = new Face(size);
  /* @var actionsQueue
   * holds actions, which possess:
   * @var creationFrame (when was action added)
   * @var frameDuration (how many frames before callback)
   * @function cycle function called every frame until frameDuration
   * @function callback (what should happen after action?
   *                     Action is deleted after callback.)
   * NOTE: currently array, but is is necessary to hold multiple actions at once?
   */
  this.actionsQueue = [];
  /* @var voice
   * say stuff
   */
  this.voice = new Voice(this);
  /* @var ears
   * listen to stuff
   */
  this.ears = new Ears(this);
  // save name, age etc on user
  this.user = new Person();
  /* @var commands
   * list of commands SJON-i understands
   * TODO: translate to English
   */
  this.commands = [
    new Command(this, /(hallo|hey|hoi|hai|hi|yo|goede(middag|morgen|navond|ndag))( (johnny|sjoni|shani|sean))?/i, function(expr, rest, args) {
      this.parent.say([rest + (typeof this.parent.user.name === "undefined" ? "" : " " + this.parent.user.name), "Alles goed?"], 100);
    }, [1]),
    new Command(this, /(((hoe (is|gaat) het)|alles goed)|(vakken|waka|f\*\*\*|fuck|fack|fakka))( met jou)?( (johnny|sjoni|shani|sean))?(\?)?/i, function(expr, rest, args) {
      if(rest === "vakken" ||
        rest === "waka" ||
        rest === "f***" ||
        rest === "fuck" ||
        rest === "fack" ||
        rest === "fakka") {
        this.parent.say(["Fakka bruur!", "Mijn hoofd is heet!", "Ik maak geen grappen A neef!"], 150);
      } else {
        this.parent.say(["Met mij gaat alles goed, " + (typeof this.parent.user.name === "undefined" ? "" : " " + this.parent.user.name), "Hoe gaat het met jou?"], 100);
      }
    }, [5]),
    new Command(this, /(Ik )?heet ([\w\s]{2,})|(Mijn )?naam is ([\w\s]{2,})|Ik ben ([a-zA-Z ]{2,})/i, function(expr, rest, args) {
      const str = rest.toLowerCase().replace(/([^a-z])([a-z])(?=[a-z]{2})|^([a-z])/g, function(_, g1, g2, g3) {
        return (typeof g1 === 'undefined') ? g3.toUpperCase() : g1 + g2.toUpperCase();});
      this.parent.user.name = str;
      this.parent.say(["Dus jij heet " + this.parent.user.name, "Wat een leuke naam."], 100);
    }, [2, 4, 5]),
    new Command(this, /Ik ben (\d{1,3})( jaar oud)?|(Mijn )?leeftijd is (\d{1,3})/i, function(expr, rest, args) {
      this.parent.user.age = parseInt(rest);
      if(this.parent.user.age < 18) {
        this.parent.say(["Zo hey, " + this.parent.user.age, "Jij bent nog niet zo oud.", "Ik ben eigenlijk bedoeld voor ouderen"], 200);
      } else {
        this.parent.say(["Wat leuk dat je " + this.parent.user.age + " jaar bent."], 200);
      }
    }, [1, 4]),
    new Command(this, /met mij (gaat|gaan|is) (het|alles|het|dingen|het leven) (goed|slecht|redelijk)|ik (voel me|ben) (verdrietig|boos|blij|treurig|gelukkig|moe)/i, function(expr, rest, args) {
      if(rest === "goed" ||
        rest === "redelijk" ||
        rest === "blij" ||
        rest === "gelukkig") {
        this.parent.say(["Wat fijn dat jij je " + rest + " voelt, " + (typeof this.parent.user.name === "undefined" ? "" : " " + this.parent.user.name)], 0);
      } else {
        this.parent.say(["Wat vervelend dat jij je " + rest + " voelt, " + (typeof this.parent.user.name === "undefined" ? "" : " " + this.parent.user.name)], 0);
        this.parent.joke("Ik zal je opvrolijken met een grap.");
      }
    }, [3, 5]),
    new Command(this, /Hoe heet ik(\?)?|Wat is mijn naam(\?)?|Weet je hoe ik heet(\?)?/i, function(expr, rest, args) {
      if(typeof this.parent.user.name === "undefined") {
        this.parent.say(["Ik weet nog niet hoe je heet.", "Vertel me eens hoe je heet!"], 200);
      } else {
        this.parent.say(["Jouw naam is " + this.parent.user.name], 0);
      }
    }, []),
    new Command(this, /(Vertel)?( me)? een (grap|mop)|(zeg|vertel)?( me)? iets (grappigs|leuks)|(tap|wat)? een mop|maak een grap/i, function(expr, rest, args) {
      this.parent.joke("Ik zal een mop vertellen");
    }, []),
    new Command(this, /Wil je nog iets zeggen/i, function(expr, rest, args) {
      this.parent.say(["Ja", "Jullie moeten een 10 krijgen"], 150);
    }, [])
  ];
}

/* @function trigger
 * voor debugging
 */
SJON_i.prototype.trigger = function(trigger) {
  var matched = false;
  for(var i = 0; i < this.commands.length; i++) {
    if(this.commands[i].matches(trigger)) {
      matched = true;
      break;
    }
  }
  return matched;
}

SJON_i.prototype.retryRecog = function(type) {
  return;
  console.log("Failed recognition type " + type);
  switch(type) {
    case 1:
      // worst case, no recognition
      this.say(["Sorry, ik kon je niet verstaan!", "Probeer duidelijker te spreken."], 220, this);
      break;
    case 2:
      // recognition, but no match in SJON-i commands
      this.say(["Ik begrijp je niet!", "Probeer het op een andere manier te zeggen!"], 220, this);
      break;
    default:
      this.say([], 0, this);
  }
}

SJON_i.prototype.language = "nl-NL";


/* @var debug
 * used for development
 */
SJON_i.prototype.debug = false;


SJON_i.prototype.cycle = function() {
    this.update();
    this.show();
    // add some pseudorandomness to SJON-i's behaviour
    if (this.actionsQueue.length === 0 && !this.speaking) {
      if (Math.random() < 0.001) {
        this.blink(17);
      } else if (Math.random() < 0.0003) {
        this.think(30);
      } else if (Math.random() < 0.001) {
        this.smile(60);
      }
    }
    // for debugger
    function y(i) {
      return 20 + 20 * i;
    }
    if (SJON_i.prototype.debug) {
      textSize(18);
      textAlign(RIGHT);
      fill(255, 0, 0);
      noStroke();
      const x = width - 10;
      text("Actions: \t\t\t\t" + this.actionsQueue.length, x, y(0));
      text("Speaking: \t\t" + this.speaking, x, y(1));
      text("Voicelang: \t" + Voice.prototype.voices[this.voice.voiceIndex].lang, x, y(2));
      text("Recoglang: \t" + Ears.prototype.recognition.lang, x, y(3));
    }
  }
  /* @function think
   * make SJON-i think
   */
SJON_i.prototype.think = function(duration) {
  this.actionsQueue.push(new Action(this, function() {
    this.ancestor.setEmotion("thinking");
  }, function() {
    sjoni.setEmotion("neutral");
  }, duration));
}

/* @function talk
 * move mouth
 * NOTE: actual speech synthesis not taken care of in this scope
 */
SJON_i.prototype.talk = function() {
  // animation taken care of in @function Mouth.prototype.show
  this.face.mouth.emotion = "talking";
  this.speaking = true;
}

SJON_i.prototype.say = function(texts, timeout, sjoniInst, callback) {
  this.voice.say(texts, timeout, sjoniInst, callback);
}

/* @function blink
 * make SJON-i wink
 */
SJON_i.prototype.blink = function(duration, eyeIndex) {
  if (typeof eyeIndex === "undefined") {
    eyeIndex = getRandomIntInclusive(0, this.face.eyes.length - 1);
  }
  this.actionsQueue.push(new Action(this, function() {
    this.ancestor.face.eyes[this.eyeIndex].emotion = "happy";
  }, function() {
    sjoni.setEmotion("neutral", true, false);
  }, duration, frameCount, eyeIndex));
}

/* @function smile
 * make SJON-i laugh
 */
SJON_i.prototype.smile = function(duration) {
  this.actionsQueue.push(new Action(this, function() {
    this.ancestor.setEmotion("happy");
  }, function() {
    sjoni.setEmotion("neutral");
  }, duration));
}

/* @function set
 * reset to neutral state
 */
SJON_i.prototype.setEmotion = function(emotion, eyes, mouth, clearActions) {
  if (typeof eyes === "undefined" || eyes === true) {
    for (var i = 0; i < this.face.eyes.length; i++) {
      this.face.eyes[i].emotion = emotion;
    }
  }
  if (typeof mouth === "undefined" || mouth === true) {
    this.face.mouth.emotion = emotion;
    if (emotion === "neutral") {
      this.speaking = false;
    }
  }
  if (typeof clearActions !== "undefined" && clearActions === true) {
    // delete all actions
    this.actionsQueue = [];
  }
}

/* @function update
 * update texts etc.
 * for example: if a text should be moved up 10px in one drawcycle, it is taken care of here.
 */
SJON_i.prototype.update = function() {
  for (var i = 0; i < this.actionsQueue.length; i++) {
    if (this.actionsQueue[i].run() === true) {
      // klaar, delete het
      this.actionsQueue.splice(i, 1);
    }
  }
}

/* @function show
 * display SJON-i
 */
SJON_i.prototype.show = function() {
  this.face.show();
}