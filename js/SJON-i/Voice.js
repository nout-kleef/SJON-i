function Voice(sjoniInstance, pitch, rate) {
  this.parent = sjoniInstance;
  const i = Voice.prototype.getVoiceIndex(SJON_i.prototype.language);
  this.voiceIndex = i === false ? 0 : i;
  this.pitch = typeof pitch === "undefined" ? 1.2 : pitch;
  this.rate = typeof rate === "undefined" ? 1 : rate;
}

Voice.prototype.speech = window.speechSynthesis;

/* @var voices
 * statische lijst van stemmen waarvan een instantie er één kan hebben
 */
Voice.prototype.voices = Voice.prototype.speech.getVoices();

populateVoiceList();
// wait on voices to be loaded before fetching list
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
 * Voice.prototype.voices is een array, we zoeken de bijbehorende index voor voice
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
 * statische functie waarmee een Voice kan "spreken"
 */
Voice.prototype.say = function(texts, timeout, sjoniInst, callback) {
  console.info("" + texts[0]);
  var t = this;
  // maak nieuwe utterance aan
  var utterThis = new SpeechSynthesisUtterance(texts[0]);
  // stel stem in
  utterThis.voice = Voice.prototype.voices[t.voiceIndex];
  // stel pitch in
  utterThis.pitch = t.pitch;
  // stel snelheid in
  utterThis.rate = t.rate;
  // TODO: pauzeer de oren van SJON_i
  // zorg voor de praat-animatie
  // TODO: op dit moment staat er letterlijk "sjoni" in de code.
  // Dat mag natuurlijk niet omdat we hiet nooit zeker weten of sjoni al wel bestaat...
  utterThis.onstart = utterThis.onresume = function() {
    // begin met praten
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
        // klaar met texts, callback
        callback(sjoniInst);
      }
      t.parent.ears.listen();
    }
  }
  utterThis.onpause = utterThis.onerror = function() {
    // stop met praten
    sjoni.setEmotion("neutral");
  }
  // spreek het uit
  Voice.prototype.speech.speak(utterThis);
  // TODO: hervat de oren van SJON_i
}