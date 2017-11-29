function Ears(parent) {
  this.parent = parent;
  this.hearingAudio = false;
  this.hearingSpeech = false;
  console.log(1111);
  this.listen();
}

Ears.prototype.recognition = new webkitSpeechRecognition();

Ears.prototype.recognition.lang = SJON_i.prototype.language;

Ears.prototype.recognition.continuous = false;
Ears.prototype.recognition.interimResults = false;
Ears.prototype.recognition.maxAlternatives = 1;

Ears.prototype.retryType = 0;

Ears.prototype.listen = function() {
  Ears.prototype.retryType = 0;
  try {
    this.recognition.start();
  } catch(e) {
    //console.warn("Recognition already started");
  }
  //console.info("Started listening.");
}

Ears.prototype.recognition.onsoundstart = function() {
  this.hearingAudio = true;
  //console.info("Audio: YES");
}

Ears.prototype.recognition.onspeechstart = function() {
  this.hearingSpeech = true;
  //console.info("Speech: YES");
}

Ears.prototype.recognition.onspeechend = function() {
  this.hearingSpeech = false;
  //console.info("Speech: NO");
}

Ears.prototype.recognition.onsoundend = function() {
  this.hearingAudio = false;
  //console.info("Audio: NO");
}

Ears.prototype.recognition.onend = function() {
  //console.info("Stopped listening.");
  if(Ears.prototype.retryType === 0) {
    sjoni.retryRecog(0);
  }
}

Ears.prototype.recognition.onnomatch = function() {
  //console.log("Failed speech recognition: no match.");
  sjoni.retryRecog(1);
}

Ears.prototype.recognition.onresult = function(e) {
  console.log(e.results[0]);
  if(e.results[0].isFinal) {
    if(SJON_i.prototype.debug) {
      console.log(e.results[0][0].transcript);
      document.getElementById("log1").innerHTML = e.results[0][0].transcript + "\n" + document.getElementById("log1").innerHTML;
    }
    if(!sjoni.trigger(e.results[0][0].transcript)) {
      // no match
      sjoni.retryRecog(2);
    }
  } else {
   // console.log("Not final");
  }
}