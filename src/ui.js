import * as audio from './audio.js';
import {utils} from './utils.js';
import * as main from './main.js';

let volumeSlider;

let gui, play, pause, restart;

let controls = {
    play: function() {
        if (audio.audioCtx.state == 'suspended') {
            audio.audioCtx.resume();
        }
        
        audio.playCurrentSound();
        
        // reset part of dropdown
        gui.remove(play);
        gui.remove(restart);
        pause = gui.add(controls, 'pause');
        restart = gui.add(controls, 'restart');
    }, 
    pause: function() {
        audio.pauseCurrentSound();
        
        // reset part of dropdown
        gui.remove(pause);
        gui.remove(restart);
        play = gui.add(controls, 'play');
        restart = gui.add(controls, 'restart');
    }, 
    restart: function() {
        main.reset();
    }, 
    song: 'bury a friend - Billie Eilish', 
    volume: 20, 
    playerSpeed: 1, 
    enemySpeed: 1, 
    livingWalls: true, 
    livingIndicator: true
}

function setUpUI() {
    // setup dat.gui
    gui = new dat.GUI();
    gui.add(controls, 'song', ["Home - Resonance", "Shelter (Madeon's Evil Edit) - Porter Robinson, Madeon", "bury a friend - Billie Eilish"]).onChange(function(newValue) {
        setSong(newValue);
    });
    gui.add(controls, 'volume', 0, 100).onChange(function(newValue) {
        audio.setVolume(newValue / 100);
    });
    gui.add(controls, 'playerSpeed', 1, 3).onChange(function(newValue) {
        main.player.speed = newValue;
    });
    gui.add(controls, 'enemySpeed', 1, 3).onChange(function(newValue) {
        for(const enemy of main.enemies) {
            enemy.speed = newValue;
        }
    });
    gui.add(controls, 'livingWalls').onChange(function(newValue) {
        main.drawParams.livingWalls = newValue;
    });
    gui.add(controls, 'livingIndicator').onChange(function(newValue) {
        main.drawParams.livingIndicator = newValue;
    });
    play = gui.add(controls, 'play');
    restart = gui.add(controls, 'restart');
}

function setSong(song) {
    let playing = audio.playing;
    if(playing)
        audio.pauseCurrentSound();
    audio.element.remove();

    switch(song) {
        case "Home - Resonance":
            main.beatParams.bpm = 85;
            main.beatParams.timeSinceLastBeat = main.beatParams.spb() * 1000;
            audio.setupWebaudio('src/HOME-Resonance.mp3');
            break;
        case "Shelter (Madeon's Evil Edit) - Porter Robinson, Madeon":
            main.beatParams.bpm = 90;
            main.beatParams.timeSinceLastBeat = -2000;
            audio.setupWebaudio('src/evil shelter.mp3');
            break;
        default:
            main.beatParams.bpm = 120;
            main.beatParams.timeSinceLastBeat = -700;
            audio.setupWebaudio('src/Billie Eilish - bury a friend.mp3');
    }
    
    main.reset();
    if(playing)
        audio.playCurrentSound();
}

export { setUpUI };