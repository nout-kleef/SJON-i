<?php
require_once "/home/nkleef/private/modOnly.php";
?>
<!DOCTYPE html />
<html lang="nl">
  <head>
    <base href="/SJON-i/" />
    <meta name="author" content="Nout Kleef">
    <link rel="shortcut icon" href="/images/favicon.ico?v=2" />
    <title>SJON-i</title>
    <script src="//console.re/connector.js" data-channel="try-1e85-b6c5-a9dd" id="consolerescript"></script>
    <script>console.re.log('remote log test');</script>
    <script src="p5.min.js"></script>
    <script src="handler.js"></script>
  </head>
  <body>
    <button onclick="fullScreen()">
      Fullscreen
    </button>
    <div id="canvasHolder"></div>
    <button onclick="sjoni.think(45)">
      denk
    </button>
    <button onclick="sjoni.blink(20)">
      knipoog
    </button>
    <button onclick="sjoni.smile(60)">
      lach
    </button><br>
    <input value="Ik heet Platon" id="utterance1" style="width:500" />
    <button onclick="sjoni.trigger(document.getElementById('utterance1').value)">
      trigger
    </button>
    <br>
    <input value="Ik ben 17 jaar" id="utterance2" style="width:500" />
    <button onclick="sjoni.trigger(document.getElementById('utterance2').value)">
      trigger
    </button>
    <br>
    <input value="Vertel een grap" id="utterance3" style="width:500" />
    <button onclick="sjoni.trigger(document.getElementById('utterance3').value)">
      trigger
    </button>
    <br>
    <input value="Goedemiddag sjoni" id="utterance4" style="width:500" />
    <button onclick="sjoni.trigger(document.getElementById('utterance4').value)">
      trigger
    </button>
    <br>
    <input value="Met mij gaat het goed" id="utterance5" style="width:500" />
    <button onclick="sjoni.trigger(document.getElementById('utterance5').value)">
      trigger
    </button>
    <br>
    <input value="Wil je nog iets zeggen?" id="utterance6" style="width:500" />
    <button onclick="sjoni.trigger(document.getElementById('utterance6').value)">
      trigger
    </button>
    <br>
    <button onclick="sjoni.joke()">
      vertel grap
    </button>
    <select id="voiceSelect">
      
    </select>
    <button onclick="console.re.log(sjoni.ears)">
      log sjoni
    </button><br />
    <button onclick="console.re.log(Ears)">
      log Ears
    </button><br />
    <h2>
      log
    </h2><br />
    <textarea cols="50" rows="50" id="log1">
    
    </textarea>
  </body>
  <script src="SJON_i.js"></script>
  <script src="Eye.js"></script>
  <script src="Command.js"></script>
  <script src="Ears.js"></script>
  <script src="Action.js"></script>
  <script src="Mouth.js"></script>
  <script src="Voice.js"></script>
  <script src="Person.js"></script>
  <script src="Face.js"></script>
</html>