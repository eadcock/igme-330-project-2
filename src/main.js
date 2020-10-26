import {
    utils
} from './utils.js';
import * as audio from './audio.js';
import * as input from './input.js';
import * as gameObjects from './game-objects.js';
import {Maze, Cell} from './Maze.js';
import { setUpUI } from './ui.js';

let canvas, ctx, analyserNode, audioData;
const canvasWidth = 1080;
const canvasHeight = 720;
let fps = 30;
let player;

// bpms
// home 170/2 = 85
// shelter = 90
// bury a friend = 120

const beatParams = {
    bpm: 120,
    spb: _ => 60 / beatParams.bpm,
    timeSinceLastBeat: -700,
    last: 0
}

let beat = [];
let maxRadius = 78;
let walls = [];
let enemies = [];

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

    

    audio.setVolume(0.2);

    setUpUI();

    loop();
}

function buildLevel() {
    // build walls
    maze = new Maze(ctx, walls, canvasWidth, canvasHeight, 12, 8);

    // walls.push(new gameObjects.Wall(ctx, 0, 395, 300, 5)); // bottom
    // walls.push(new gameObjects.Wall(ctx, 0, 0, 5, 400)); // left
    // walls.push(new gameObjects.Wall(ctx, 0, 0, 600, 5));
    // walls.push(new gameObjects.Wall(ctx, 400, 395, 200, 5));

    // walls.push(new gameObjects.Wall(ctx, 595, 0, 5, 400)); // right

    // walls.push(new gameObjects.Wall(ctx, 100, 0, 5, 200)); // top left L
    // walls.push(new gameObjects.Wall(ctx, 100, 200, 100, 5));

    // walls.push(new gameObjects.Wall(ctx, 300, 0, 5, 100)); // entrance
    // walls.push(new gameObjects.Wall(ctx, 200, 100, 105, 5));

    // walls.push(new gameObjects.Wall(ctx, 500, 100, 5, 100)); // right L
    // walls.push(new gameObjects.Wall(ctx, 500, 200, 100, 5));

    
    // walls.push(new gameObjects.Wall(ctx, 300, 200, 5, 200)); // cross
    // walls.push(new gameObjects.Wall(ctx, 100, 300, 400, 5));
    // walls.push(new gameObjects.Wall(ctx, 400, 100, 5, 200));
    
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
    player.update(enemies, walls);

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
    player.drawIndicator(audioData, true);
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
        walls[i].draw(audio.audioData);
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        
        // draw surrounding circle
        // ctx.beginPath();
        // ctx.strokeStyle = utils.makeColor(255, 0, 0, 0.9);
        // ctx.lineWidth = 2;
        // ctx.arc(enemies[i].x, enemies[i].y, avg, 0, 2 * Math.PI, false);
        // ctx.stroke();
        // ctx.closePath();
    }
    ctx.restore();

    player.draw();
    
    ctx.restore();

    beatParams.last = now;
}

// function bpmVisionCone(now) {
//     if(!timeSinceLastBeat) timeSinceLastBeat = 0;
//     timeSinceLastBeat += now - (last ?? 0);
//     if(timeSinceLastBeat > spb * 1000) {
//         beat.push(new gameObjects.BeatCone(ctx, () => player.x, () => player.y, now, maxRadius, 1, beat.length == 0));
//         timeSinceLastBeat = 0;
//     }
    
//     ctx.save();
//     if(beat.length > 1 && beat[0].update(now)) {
//         beat[1].oldest = true;
//         beat.splice(0, 1);
//         ctx.restore();
//         ctx.save();
//         beat[0].update(now);
//     }
//     for(let i = beat.length - 1; i > 0; i--) {
//         if(beat[i].update(now)) {
//             beat.splice(i, 1);
//         } 
//     }
//     last = now;
// }

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

export {
    canvasWidth,
    canvasHeight,
    player,
    init,
    reset,
    beatParams,
    beat
};