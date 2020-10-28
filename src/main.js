import {
    utils
} from './utils.js';
import * as audio from './audio.js';
import * as input from './input.js';
import * as gameObjects from './game-objects.js';
import {Maze} from './Maze.js';
import { setUpUI } from './ui.js';

let canvas, ctx, analyserNode, audioData;
const canvasWidth = 1080;
const canvasHeight = 720;
let player;

const beatParams = {
    bpm: 120,
    spb: _ => 60 / beatParams.bpm,
    timeSinceLastBeat: -300,
    last: 0
}

const drawParams = {
    livingWalls: true,
    livingIndicator: true
}

const audioParams = {
    distort: true
}

let beat = [];
let maxRadius = 78;
let walls = [];
let enemies = [];
let progressBars = [];

let maze;

document.addEventListener('keydown', input.manageKeyDown);
document.addEventListener('keyup', input.manageKeyUp);

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');
    buildLevel(ctx);

    audio.setupWebaudio('src\\Billie Eilish - bury a friend.mp3');

    player = new gameObjects.Player(ctx, 250, 50, 0, 0);

    createProgressIndicator();

    audio.setVolume(0.2);

    setUpUI();

    loop();
}

function on_fullscreen_change() {
    if(document.mozFullScreen || document.webkitIsFullScreen) {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    else {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }
}

document.addEventListener('mozfullscreenchange', on_fullscreen_change);
document.addEventListener('webkitfullscreenchange', on_fullscreen_change);

function buildLevel() {
    // build walls
    maze = new Maze(ctx, walls, canvasWidth, canvasHeight, 12, 8);
    
    // build enemies
    enemies.push(new gameObjects.Enemy(ctx, [{x:50, y:50}, {x:50, y:350}, {x:250, y:350}]));
    enemies.push(new gameObjects.Enemy(ctx, [{x:550, y:150}, {x:550, y:50}, {x:350, y:50}, {x:350, y:250}, {x:350, y:50}, {x:550, y:50}]));
}

function reset() {
    player.resetPosition();
    walls = [];
    enemies = []
    buildLevel();
}

function loop(now) {
    requestAnimationFrame(loop);

    audio.update(now);
    player.update(enemies, walls, audio.oscillator, audioParams.distort);

    ctx.save();

    if(audio.playing) beatParams.timeSinceLastBeat += now - (beatParams.last ?? 0);
    if(beatParams.timeSinceLastBeat > beatParams.spb() * 1000) {
        beat.push(new gameObjects.BeatCone(ctx, player.x, player.y));
        beatParams.timeSinceLastBeat = 0;
    }

    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.2;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if(audio.playing) {
        for(let i = 0; i < beat.length; i++) {
            if(beat[i].update(now)) {
                beat.splice(i, 1);
            }
        }
    }

    let audioData = new Float32Array(audio.analyserNode.fftSize);
    audio.analyserNode.getFloatTimeDomainData(audioData);
    player.drawIndicator(audioData, true, drawParams.livingIndicator);
    ctx.restore();

    if(audio.playing) {
        for(let i = 0; i < beat.length; i++) {
            beat[i].drawOutline();
        }
    }
    // draw all sound circles
    // use ctx.clip() to draw circles
    // frequencyVisionCone();
    // draw all hidden objects

    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    audio.analyserNode.getByteFrequencyData(audio.audioData);
    walls[0].resetIndex();
    for(let i = 0; i < walls.length; i++) {
        walls[i].draw(audio.audioData, drawParams.livingWalls);
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }
    ctx.restore();

    player.draw();

    updateProgressIndicator();
    drawProgressIndicator();
    
    ctx.restore();

    

    beatParams.last = now;
}

function frequencyVisionCone() {
    audio.analyserNode.getByteFrequencyData(audio.audioData);
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
    ctx.arc(player.x, player.y, 20, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.clip();
    ctx.closePath();

    ctx.globalAlpha = 1;
    // draw all hidden objects
    
    for(let i = 0; i < walls.length; i++) {
        walls[i].draw();
    }
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        
        // draw surrounding circle
        ctx.beginPath();
        ctx.strokeStyle = utils.makeColor(255, 0, 0, 0.9);
        ctx.lineWidth = 2;
        ctx.arc(enemies[i].x, enemies[i].y, avg, 0, 2 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.restore();
}

const progressParams = {
    thickness: 20,
}

function createProgressIndicator() {
    progressBars.push(
        new gameObjects.Rectangle(ctx, 0, 0, progressParams.thickness, progressParams.thickness), // down
        new gameObjects.Rectangle(ctx, 0, 0, progressParams.thickness, progressParams.thickness), // right
        new gameObjects.Rectangle(ctx, canvasWidth, canvasHeight - progressParams.thickness, progressParams.thickness, progressParams.thickness), // left
        new gameObjects.Rectangle(ctx, canvasWidth - progressParams.thickness, canvasHeight, progressParams.thickness, progressParams.thickness)); // up
}

function updateProgressIndicator() {
    let progress = utils.clamp(audio.element.currentTime / audio.element.duration, 0, 1);
    if(!progress) progress = 0;
    progressBars[0].h = utils.map(progress, [0, 1], [progressParams.thickness, canvasHeight]);
    progressBars[1].w = utils.map(progress, [0, 1], [progressParams.thickness, canvasWidth]);
    progressBars[2].x = utils.map(progress, [0, 1], [canvasWidth - progressParams.thickness, progressParams.thickness]);
    progressBars[2].w = canvasWidth - progressBars[2].x;
    progressBars[3].y = utils.map(progress, [0, 1], [canvasHeight - progressParams.thickness, progressParams.thickness]);
    progressBars[3].h = canvasHeight - progressBars[3].y;
}

function drawProgressIndicator() {
    for(const bar of progressBars) {
        bar.draw();
    }
}

export {
    canvasWidth,
    canvasHeight,
    player,
    enemies,
    init,
    reset,
    beatParams,
    beat,
    drawParams,
    audioParams,
    canvas
};