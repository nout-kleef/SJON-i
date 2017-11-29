var myFont;
var v = [{x:0,y:0},{x:100,y:100}];
var pfx = ["webkit", "moz", "ms", "o", ""];

function RunPrefixMethod(obj, method) {
  var p = 0;
  var m;
  var t;
  while (p < pfx.length && !obj[m]) {
    m = method;
    if (pfx[p] === "") {
      m = m.substr(0, 1).toLowerCase() + m.substr(1);
    }
    m = pfx[p] + m;
    t = typeof obj[m];
    if (t != "undefined") {
      pfx = [pfx[p]];
      return (t == "function" ? obj[m]() : obj[m]);
    }
    p++;
  }
}

function fullScreen() {
  if (!RunPrefixMethod(document, "FullScreen") && !RunPrefixMethod(document, "IsFullScreen")) {
    RunPrefixMethod(document.getElementById("defaultCanvas0"), "RequestFullScreen");
    console.info("fullscreen requested.");
  }
}

/* @function preload
 * zorgt ervoor dat alle media geladen is voor setup()
 */
function preload() {
  myFont = loadFont('fonts/robot01.ttf');
  // make sure the pictures are loaded
  Eye.prototype.neutral = loadImage("img/eye-neutral-min.png");
  Eye.prototype.happy = loadImage("img/eye-happy-min.png");
  Eye.prototype.thinking = loadImage("img/eye-thinking-min.png");
  Mouth.prototype.neutral = loadImage("img/mouth-neutral-min.png");
  Mouth.prototype.happy = loadImage("img/mouth-happy-min.png");
  Mouth.prototype.thinking = loadImage("img/mouth-thinking-min.png");
  Mouth.prototype.talking = [];
  for(var i = 0; i < 11; i++) {
    // laad alle monden die nodig zijn voor de praat-animatie
    Mouth.prototype.talking.push(loadImage("img/mouth-talking-" + i + "-min.png"));
  }
}

/* @function setup
 * p5.js called deze functie 1x, direct na @function preload.
 */
function setup() {
  const size = Math.min(window.screen.width, window.screen.height);
  var cnv = createCanvas(size, size);
  cnv.parent("canvasHolder");
  textFont(myFont);
  sjoni = new SJON_i();
}

/* @function draw
 * p5.js tracht deze functie 60x/seconde te callen, kan in theorie ook minder vaak zijn.
 */
function draw() {
  background(0);
  sjoni.cycle();
}

/* @function getRandomIntInclusive
 * returned een integer tussen de twee gespecificeerde waarden (inclusive, inclusive)
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}