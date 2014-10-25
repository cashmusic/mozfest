/**
 *  DEMO
 *  - find the peaks in an audio file to draw the entire waveform with SoundFile.getPeaks();
 *  - draw cursor on a timeline with SoundFile.currentTime() and SoundFile.duration();
 */

// ====================

var soundFile;

var peakCount = 100;

function preload() {
  soundFile = loadSound('../../music/Broke_For_Free_-_01_-_As_Colorful_As_Ever.ogg');
}

function setup() {
  createCanvas(800, 400);
  soundFile.loop();
  background(0);
}


function draw() {
  background(255);

  peakCount = round( map(mouseY, height, 0, 5, 1000) );
  if (peakCount < 8) {
    peakCount = 8;
  }

  var waveform = soundFile.getPeaks(peakCount);
  fill(0);
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (var i = 0; i< waveform.length; i++){
    vertex(map(i, 0, waveform.length, 0, width), map(waveform[i], -1, 1, height, 0));
  }
  endShape();

  drawPlayhead();
}


function drawPlayhead() {
  noStroke();
  fill(0,255,0);
  rect(map(soundFile.currentTime(), 0, soundFile.duration(), 0, width), 0, 5, height);
}
