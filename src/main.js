import {
    utils
} from './utils.js';
import * as audio from './audio.js';

let canvas, ctx, analyserNode, audioData;
const canvasWidth = 600;
const canvasHeight = 400;
let fps = 30;

window.onload = init;

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    
    audio.setupWebaudio();
    audioData = new Uint8Array(audio.analyserNode.fftSize / 2);

    loop();
}

function loop() {
    requestAnimationFrame(loop);

    // draw black background
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // draw all objects *not* hidden here
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(canvasWidth / 2, canvasHeight / 2, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    // draw all sound circles
    // use ctx.clip() to draw circles
    let maxRadius = canvasHeight / 4;
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < audioData.length; i++) {
        let percent = audioData[i] / 255;
        let circleRadius = percent * maxRadius;

        // red-ish circles
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(255, 111, 111, 0.34 - percent / 3.0);
        ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();

        // blue-ish circles, bigger, more transparent
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(0, 0, 255, 0.10 - percent / 10.0);
        ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();

        // yellow-ish circles, smaller
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = utils.makeColor(200, 200, 0, 0.5 - percent / 5.0);
        ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 0.50, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    ctx.restore();

    // draw all hidden objects
}

export {
    canvasWidth,
    canvasHeight
};