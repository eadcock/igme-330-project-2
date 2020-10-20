import {
    utils
} from './utils.js';
import * as audio from './audio.js';
import * as input from './input.js';
import * as gameObjects from './game-objects.js';

let canvas, ctx, analyserNode, audioData;
const canvasWidth = 600;
const canvasHeight = 400;
let fps = 30;
let player;
let walls = [];
window.onload = init;
document.addEventListener('keydown', input.manageKeyDown);
document.addEventListener('keyup', input.manageKeyUp);

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    player = new gameObjects.Player(ctx, 250, 50, 0, 0);
    buildLevel(ctx);

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

function buildLevel(ctx) {
    // build walls
    walls.push(new gameObjects.Wall(ctx, 0, 0, 600, 5));

    walls.push(new gameObjects.Wall(ctx, 0, 0, 5, 400)); // left

    walls.push(new gameObjects.Wall(ctx, 0, 395, 300, 5)); // bottom
    walls.push(new gameObjects.Wall(ctx, 400, 395, 200, 5));

    walls.push(new gameObjects.Wall(ctx, 595, 0, 5, 400)); // right

    walls.push(new gameObjects.Wall(ctx, 100, 0, 5, 200)); // top left L
    walls.push(new gameObjects.Wall(ctx, 100, 200, 100, 5));

    walls.push(new gameObjects.Wall(ctx, 300, 0, 5, 100)); // entrance
    walls.push(new gameObjects.Wall(ctx, 200, 100, 105, 5));

    walls.push(new gameObjects.Wall(ctx, 500, 100, 5, 100)); // right L
    walls.push(new gameObjects.Wall(ctx, 500, 200, 100, 5));

    walls.push(new gameObjects.Wall(ctx, 500, 100, 5, 100)); // cross
    walls.push(new gameObjects.Wall(ctx, 300, 200, 5, 200));
    walls.push(new gameObjects.Wall(ctx, 100, 300, 400, 5));
    walls.push(new gameObjects.Wall(ctx, 400, 100, 5, 200));
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
    player.update(walls);

    // draw all sound circles
    // use ctx.clip() to draw circles
    let maxRadius = canvasHeight / 2;
    ctx.save();
    ctx.globalAlpha = 0.5;
    let sum = 0;
    for (let i = 0; i < audio.audioData.length; i++) {
        let percent = audio.audioData[i] / 255;
        let circleRadius = percent * maxRadius;
        sum += circleRadius;
    }

    let avg = sum / audio.audioData.length;

    ctx.beginPath();
    ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.9);
    ctx.lineWidth = 2;
    ctx.arc(player.x, player.y, avg, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.9);
    ctx.lineWidth = 2;
    ctx.arc(player.x, player.y, avg * 2, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.clip();
    ctx.closePath();

    ctx.globalAlpha = 1;
    // draw all hidden objects
    
    for(let i = 0; i < walls.length; i++) {
        walls[i].draw();
    }

    ctx.restore();
}

export {
    canvasWidth,
    canvasHeight,
    player
};