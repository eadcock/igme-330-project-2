
let audioCtx;
let element, sourceNode, analyserNode, gainNode, oscillatorNode, playing = false;
let last = 0, duration = 0;
const DEFAULTS = Object.freeze({
    gain: 0.5,
    numSamples: 256
});

let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

let oscillator = {
    startEnemyIndicator: startEnemyIndicator,
    stopEnemyIndicator: stopEnemyIndicator,
    active: false
}

let distortion;

function setupWebaudio(filePath) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    element = new Audio();
    loadSoundFile(filePath);
    sourceNode = audioCtx.createMediaElementSource(element);
    sourceNode.loop = true;
    analyserNode = audioCtx.createAnalyser();

    analyserNode.fftSize = DEFAULTS.numSamples;
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;
    distortion = audioCtx.createWaveShaper();
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(distortion);
    distortion.connect(audioCtx.destination);

    distortion.curve = makeDistortionCurve(0);
}

// http://stackoverflow.com/a/22313408/1090298
function makeDistortionCurve( amount ) {
    var k = typeof amount === 'number' ? amount : 0,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

function loadSoundFile(filePath) {
    element.src = filePath;
}

function playCurrentSound(now) {
    element.play();
    playing = true;
    last = now;
}

function pauseCurrentSound() {
    element.pause();
    playing = false;
}

function endSong() {
    duration = element.duration;
}

function setVolume(value) {
    value = Number(value);
    gainNode.gain.value = value;
}

function getVolume() {
    return gainNode.gain.value;
}

function restart() {
    element.currentTime = element.duration;
    console.log(element.currentTime);
}

function update(now) {
    if(element.currentTime == element.duration) {
        element.currentTime = 0;
    }
}

function startEnemyIndicator(amount) {
    distortion.curve = makeDistortionCurve(amount);
    oscillator.active = true;
}

function stopEnemyIndicator() {
    distortion.curve = makeDistortionCurve(0);
    oscillator.active = false;
}

export {
    audioCtx,
    setupWebaudio,
    playCurrentSound,
    pauseCurrentSound,
    loadSoundFile,
    setVolume,
    audioData,
    analyserNode,
    playing,
    update,
    endSong,
    getVolume,
    element,
    oscillator
};