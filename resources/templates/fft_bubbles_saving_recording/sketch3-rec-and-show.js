
// demo from http://p5js.org/reference/#p5.SoundRecorder

var mic, recorder, soundFile;
var state = 0;

function setup() {
  background(200);
  // create an audio in
  mic = new p5.AudioIn();
  
  // prompts user to enable their browser mic
  mic.start();
  
  // create a sound recorder
  recorder = new p5.SoundRecorder();
  
  // connect the mic to the recorder
  recorder.setInput(mic);
  
  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

  text('keyPress to record', 20, 20);
}

function keyPressed() {
  // make sure user enabled the mic
  if (state === 0 && mic.enabled) {
  
    // record to our p5.SoundFile
    recorder.record(soundFile);

    background(255,0,0); // red
    text('Recording!', 200, 20);    
    state++;
  }
  else if (state === 1) {
    background(0,255,0); // green

    // stop recorder and
    // send result to soundFile
    recorder.stop(); 
    
    text('Stopped', 20, 20);
    state++;
  }
  
  else if (state === 2) {
    soundFile.play(); // play the result!
    save(soundFile, 'mySound.wav');
    state++;
  }
}
