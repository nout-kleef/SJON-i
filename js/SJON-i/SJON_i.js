function SJON_i() {
  this.answerHandler = function() {
    
  }
  /* @const size
   * hoe groot kan het gezicht zijn?
   */
  const size = Math.min(width, height);
  this.speaking = false;
  /* @var face
   * managed het gezicht
   */
  this.face = new Face(size);
  /* @var actionsQueue
   * houdt Action instanties vast, deze bezitten:
   * @var creationFrame (when was action added)
   * @var frameDuration (hoeveel frames vóór callback)
   * @function cycle functie die elk frame wordt aangeroepen totdat frameDuration
   * @function callback (wat moet er gebeuren na frameDuration frames?
   *                     Na de callback wordt de action verwijderd.)
   * NOTE: op dit moment is het een array, maar is het wel nodig om meerdere
   * actions tegelijk vast te houden????
   */
  this.actionsQueue = [];
  /* @var voice
   * gebruikt om dingen te zeggen
   */
  this.voice = new Voice(this);
  /* @var ears
   * gebruikt voor het luisteren
   */
  this.ears = new Ears(this);
  /* @var usedJokes
   * id's van grappen die deze SJON_i instance al verteld heeft
   * NOTE @Daan: ik heb deze hier geplaatst omdat we in theorie meerdere SJON_i instances zouden kunnen hebben
   */
  this.usedJokes = [];
  // hierin worden dingen zoals de naam enzo opgeslagen
  this.user = new Person();
  /* @var commands
   * dit zijn de speech commands waarmee je tegen SJON_i kunt praten
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

// snelle functie om een grap te vertellen
SJON_i.prototype.joke = function(prelude) {
  this.loadJoke(this.selectRandomJokeId(), prelude);
}

/* @var jokeIdBoundaries
 * min en max id's van grappen (toch? @Daan)
 * staat in proto omdat t voor elke sjoni 't zelfde is
 */
SJON_i.prototype.jokeIdBoundaries = [1, 48];

SJON_i.prototype.selectRandomJokeId = function() {
  // IDEA @Daan: kan dit niet met een do{}while()?
  const number = getRandomIntInclusive(SJON_i.prototype.jokeIdBoundaries[0], SJON_i.prototype.jokeIdBoundaries[1]);
  var used = false;
  for (var i = 0; i < this.usedJokes.length; i++) {
    used = this.usedJokes[i] === number || used;
  }
  if (!used) {
    return number;
  } else {
    if (this.usedJokes.length === SJON_i.prototype.jokeIdBoundaries[1] - SJON_i.prototype.jokeIdBoundaries[0] + 1) {
      this.usedJokes = [];
    }
    // restart
    return SJON_i.prototype.selectRandomJokeId();
  }
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
      // worst case, geen recognition
      this.say(["Sorry, ik kon je niet verstaan!", "Probeer duidelijker te spreken."], 220, this);
      break;
    case 2:
      // wel recognition, geen match in de commandos
      this.say(["Ik begrijp je niet!", "Probeer het op een andere manier te zeggen!"], 220, this);
      break;
    default:
      this.say([], 0, this);
  }
}

SJON_i.prototype.loadJoke = function(jokeId, prelude) {
  // lelijk, maar is nodig omdat de scope in onreadystatechange anders is.
  var instance = this;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        instance.tellJoke(JSON.parse(xhttp.responseText), jokeId, prelude);
      } else if (xhttp.status >= 300) {
        // error
        this.errorRetrievingJoke();
      }
  };
  xhttp.open('GET', 'http://dvelthuis.informatica.bc-enschede.nl/SJON-i/grap.php?grapid=' + jokeId, true);
  xhttp.send();
}

SJON_i.prototype.tellJoke = function(responseObj, jokeId, prelude) {
  if (typeof jokeId !== "undefined") {
    // @Daan hierheen verplaatst omdat we pas op dit punt zeker weten dat het vertelt zal worden
    this.usedJokes.push(jokeId);
  }
  var texts = [responseObj.setup, responseObj.clue];
  if(typeof prelude !== "undefined") {
    texts.unshift(prelude);
  }
  this.voice.say(texts, 1000);
}

SJON_i.prototype.errorRetrievingJoke = function() {
  this.say(["Sorry, ik kon eventjes geen grap bedenken. Vraag het me later nog eens!"], 0);
}

SJON_i.prototype.language = "nl-NL";


/* @var debug
 * gebruikt om extra dingen te tonen in de
 * development fase.
 */
SJON_i.prototype.debug = false;


SJON_i.prototype.cycle = function() {
    this.update();
    this.show();
    // volgende lines zijn voor wat randomness
    if (this.actionsQueue.length === 0 && !this.speaking) {
      if (Math.random() < 0.001) {
        this.blink(17);
      } else if (Math.random() < 0.0003) {
        this.think(30);
      } else if (Math.random() < 0.001) {
        this.smile(60);
      }
    }
    // voor debugger
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
   * laat sjoni denken
   * IDEA: dit verplaatsen naar sjoni.face???
   */
SJON_i.prototype.think = function(duration) {
  this.actionsQueue.push(new Action(this, function() {
    this.ancestor.setEmotion("thinking");
  }, function() {
    sjoni.setEmotion("neutral");
  }, duration));
}

/* @function talk
 * laat sjoni's mond bewegen
 * NOTE: het daadwerkelijke spreken wordt hier niet geregeld
 */
SJON_i.prototype.talk = function() {
  // de animatie wordt verzorgd in @function Mouth.prototype.show
  this.face.mouth.emotion = "talking";
  this.speaking = true;
}

SJON_i.prototype.say = function(texts, timeout, sjoniInst, callback) {
  this.voice.say(texts, timeout, sjoniInst, callback);
}

/* @function blink
 * laat sjoni knipogen
 * IDEA: dit verplaatsen naar sjoni.face???
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
 * laat sjoni lachen
 * IDEA: dit verplaatsen naar sjoni.face???
 */
SJON_i.prototype.smile = function(duration) {
  this.actionsQueue.push(new Action(this, function() {
    this.ancestor.setEmotion("happy");
  }, function() {
    sjoni.setEmotion("neutral");
  }, duration));
}

/* @function set
 * reset sjoni weer naar z'n neutrale "state"
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
 * functie die de huidige emotie en teksten etc. updatet, dus 
 * als een tekst bijv. 10 pixels omhoog moet in 1 frame wordt dat
 * hier geregeld.
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
 * deze functie laat daadwerkelijk de dingen zien
 * zoals het gezicht met huidige emotie en alle teksten
 */
SJON_i.prototype.show = function() {
  this.face.show();
}