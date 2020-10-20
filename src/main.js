import {
    utils
} from './utils.js';
import * as audio from './audio.js';
import * as input from './input.js';

let canvas, ctx, analyserNode, audioData;
const canvasWidth = 600;
const canvasHeight = 400;
let fps = 30;
let player;
window.onload = init;
document.addEventListener('keydown', input.manageKeyDown);
document.addEventListener('keyup', input.manageKeyUp);

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    player = new Player(250, 50);


    audio.setupWebaudio('src\\HOME - Resonance.mp3');

    document.querySelector('button').onclick = e => {
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

    audio.setVolume(0.2);

    loop();
}

function loop() {
    requestAnimationFrame(loop);
    audio.analyserNode.getByteFrequencyData(audio.audioData);

    // draw black background
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // draw all objects *not* hidden here
    player.update(ctx);

    // draw all sound circles
    // use ctx.clip() to draw circles
    let maxRadius = canvasHeight / 3;
    ctx.save();
    ctx.globalAlpha = 0.5;
    let sum = 0;
    for (let i = 0; i < audio.audioData.length; i++) {
        let percent = audio.audioData[i] / 255;
        let circleRadius = percent * maxRadius;
        sum += circleRadius;

        // // red-ish circles
        // ctx.beginPath();
        // ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.34 - percent / 3.0);
        // ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
        // ctx.stroke();
        // ctx.closePath();

        // // blue-ish circles, bigger, more transparent
        // ctx.beginPath();
        // ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.10 - percent / 7.0);
        // ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
        // ctx.stroke();
        // ctx.closePath();

        // // yellow-ish circles, smaller
        // ctx.beginPath();
        // ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.3 - percent / 20.0);
        // ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 0.50, 0, 2 * Math.PI, false);
        // ctx.stroke();
        // ctx.closePath();
    }

    let avg = sum / audio.audioData.length;

    ctx.beginPath();
    ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.9);
    ctx.lineWidth = 2;
    ctx.arc(player.position.x, player.position.y, avg, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.9);
    ctx.lineWidth = 2;
    ctx.arc(player.position.x, player.position.y, avg * 2, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.clip();
    ctx.closePath();

    ctx.globalAlpha = 1;
    // draw all hidden objects
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 600, 5); // top

    ctx.fillRect(0, 0, 5, 400); // left

    ctx.fillRect(0, 395, 300, 5); // bottom
    ctx.fillRect(400, 395, 200, 5);

    ctx.fillRect(595, 0, 5, 400); // right

    ctx.fillRect(100, 0, 5, 200); // top left L
    ctx.fillRect(100, 200, 100, 5);

    ctx.fillRect(300, 0, 5, 100); // entrance
    ctx.fillRect(200, 100, 105, 5);

    ctx.fillRect(500, 100, 5, 100); // right L
    ctx.fillRect(500, 200, 100, 5);

    ctx.fillRect(500, 100, 5, 100); // cross
    ctx.fillRect(300, 200, 5, 200);
    ctx.fillRect(100, 300, 400, 5);
    ctx.fillRect(400, 100, 5, 200);
    ctx.restore();
}

export {
    canvasWidth,
    canvasHeight,
    player
};