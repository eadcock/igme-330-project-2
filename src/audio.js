let audioCtx;
let element, sourceNode, analyserNode, gainNode, playing = false;
let last = 0, duration = 0;
const DEFAULTS = Object.freeze({
    gain: 0.5,
    numSamples: 256
});

let audioData = new Uint8Array(DEFAULTS.numSamples / 2);

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
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

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

function update(now) {
    if(playing) {
        if(!duration) duration = 0;
        duration += now - last;
        console.log(duration);
        if(duration >= element.duration * 1000) {
            console.log('end');
            element.currentTime = 0;
            duration = 0;
        }

        last = now;
    }
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
    endSong
};