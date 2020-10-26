import * as audio from './audio.js';
import {utils} from './utils.js';
import * as main from './main.js';

let volumeSlider;

function setUpUI() {
    document.querySelector('#play').onclick = e => {
        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == 'suspended') {
            audio.audioCtx.resume();
        }

        if (e.target.dataset.playing == 'no') {
            // if track is currently paused, play it
            audio.playCurrentSound();
            e.target.dataset.playing = 'yes'; // our css will set the text to 'pause'
        } else {
            // if track is playing, pause it
            audio.pauseCurrentSound();
            e.target.dataset.playing = 'no'; // our css will set the text to 'play'
        }
    }

    document.querySelector('#restart').addEventListener('click', main.reset);

    volumeSlider = document.querySelector('#volume');
    volumeSlider.addEventListener('input', e => audio.setVolume(e.target.value / 100));
    for(const radio of document.querySelectorAll('.songSelect')) {
        radio.addEventListener('change', setSong);
    }
    document.querySelector('#livingWalls').addEventListener('change', e => {
        main.drawParams.livingWalls = e.target.checked;
    });
    document.querySelector('#livingIndicator').addEventListener('change', e => {
        main.drawParams.livingIndicator = e.target.checked;
    });
}

function setSong(e) {
    if(e.target.checked) {
        let playing = audio.playing;
        if(playing)
            audio.pauseCurrentSound();
        audio.element.remove();
        audio.setupWebaudio(e.target.value);
        main.reset();
        if(playing)
            audio.playCurrentSound();

        switch(e.target.id) {
            case 'home':
                main.beatParams.bpm = 85;
                main.beatParams.timeSinceLastBeat = main.beatParams.spb() * 1000;
                break;
            case 'shelter':
                main.beatParams.bpm = 90;
                main.beatParams.timeSinceLastBeat = -2000;
                break;
            default:
                main.beatParams.bpm = 120;
                main.beatParams.timeSinceLastBeat = -700;
        }

        audio.setVolume(volumeSlider.value / 100);
    }
}

export { setUpUI };