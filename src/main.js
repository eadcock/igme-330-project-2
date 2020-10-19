import { utils } from 'utils.js';

let canvas, ctx;
const canvasWidth = 600;
const canvasHeight = 400;
let fps = 30;

window.onload = init;

function init() {
    canvas = document.querySelector('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    loop();
}

function loop() {
    // draw black background

    // draw all objects *not* hidden here

    // draw all sound circles
    // use ctx.clip() to draw circles

    // draw all hidden objects
}