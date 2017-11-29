function Voice(sjoniInstance, pitch, rate) {
  this.parent = sjoniInstance;
  const i = Voice.prototype.getVoiceIndex(SJON_i.prototype.language);
  this.voiceIndex = i === false ? 0 : i;
  this.pitch = typeof pitch === "undefined" ? 1.2 : pitch;
  this.rate = typeof rate === "undefined" ? 1 : rate;
}

Voice.prototype.speech = window.speechSynthesis;

/* @var voices
 * static list of voices of which one can be active at any given time
 */
Voice.prototype.voices = Voice.prototype.speech.getVoices();

populateVoiceList();
// wait for voices to be loaded before fetching list
Voice.prototype.speech.onvoiceschanged = populateVoiceList;

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }
  Voice.prototype.voices = Voice.prototype.speech.getVoices();
  for(var i = 0; i < Voice.prototype.voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = Voice.prototype.voices[i].name + ' (' + Voice.prototype.voices[i].lang + ')';
    if(Voice.prototype.voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', Voice.prototype.voices[i].lang);
    option.setAttribute('data-name', Voice.prototype.voices[i].name);
    document.getElementById("voiceSelect").appendChild(option);
  }
  // TODO: dit is een quick fix, moet verbeterd worden
  setTimeout(function() {
    sjoni.voice = new Voice(sjoni);
  }, 800);
}

/* @function getVoiceIndex(String lang)
 * Voice.prototype.voices is an array, get matching index of voice
 * returns: int index
 */
Voice.prototype.getVoiceIndex = function(lang) {
  var rtrnr = false;
  for(var i = 0; i < Voice.prototype.voices.length; i++) {
    if(Voice.prototype.voices[i].lang === lang) {
      rtrnr = i;
      return rtrnr;
    }
  }
  return rtrnr;
}

/* @function say
 * static function to allow Voice to synthesize speech
 */
Voice.prototype.say = function(texts, timeout, sjoniInst, callback) {
  console.info("" + texts[0]);
  var t = this;
  var utterThis = new SpeechSynthesisUtterance(texts[0]);
  utterThis.voice = Voice.prototype.voices[t.voiceIndex];
  utterThis.pitch = t.pitch;
  utterThis.rate = t.rate;
  // TODO: pause SJON-i's ears=
  // TODO: OOP sjoni. We should assume more SJON_i instances exist
  utterThis.onstart = utterThis.onresume = function() {
    sjoni.talk();
  }
  utterThis.onend = function() {
    sjoni.setEmotion("neutral");
    var newArgs = [];
    for(var i = 1; i < texts.length; i++) {
      newArgs.push(texts[i]);
    }
    if(newArgs.length !== 0) {
      setTimeout(function() {
        t.say(newArgs, timeout, sjoniInst, callback);
      }, (typeof timeout === "undefined" ? 1000 : timeout));
    } else {
      if(typeof callback === "function") {
        // done with texts, callback
        callback(sjoniInst);
      }
      t.parent.ears.listen();
    }
  }
  utterThis.onpause = utterThis.onerror = function() {
    // stop talking
    sjoni.setEmotion("neutral");
  }
  Voice.prototype.speech.speak(utterThis);
  // TODO: resume SJON-i's ears
}