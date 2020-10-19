import * as defaults from './main.js';

const utils = {
    // flatten a 2d array in to a 1d array
    flattenArray(array) {
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray = newArray.concat(array[i]);
        }
        return newArray;
    },

    random: {
        getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getRandomElement(arr) {
            return arr[getRandomInt(0, arr.length - 1)];
        },
        getRandomColor(alpha = 255) {
            const getByte = _ => 0 + Math.round(Math.random() * (255 -
                0));
            return `rgba(${getByte()},${getByte()},${getByte()},${alpha})`;
        },
    },

    draw: {
        randomRect(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(utils.random.getRandomInt(0, defaults.canvasWidth), utils.random.getRandomInt(0, defaults.canvasHeight),
                utils.random.getRandomInt(10, 20),
                utils.random.getRandomInt(10, 20));
            ctx.closePath();
            ctx.strokeStyle = utils.random.getRandomColor();
            ctx.fillStyle = utils.random.getRandomColor();
            ctx.lineWidth = utils.random.getRandomInt(1, 10);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },
        randomCircle(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(utils.random.getRandomInt(0, defaults.canvasWidth), utils.random.getRandomInt(0, defaults.canvasHeight), utils.random.getRandomInt(10,
                20), 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = utils.random.getRandomColor();
            ctx.fill();
            ctx.restore();
        },
        randomLine(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight));
            ctx.lineTo(getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight));
            ctx.closePath();
            ctx.strokeStyle = utils.random.getRandomColor();
            ctx.stroke();
            ctx.restore();
        },
        rectangle(ctx, x, y, w, h, fill = 'black', lineWidth = 1) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.lineWidth = lineWidth;
            ctx.fill();
            ctx.restore();
        },
        circle(ctx, x, y, r, start, end, anticlockwise = false, fill = 'black', strokeStyle = 'black', lineWidth = 1) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, r, start, end, anticlockwise);
            ctx.closePath();
            ctx.fillStyle = fill;
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }
    },

    cls(ctx) {
        setInterval(_ => cls(ctx), 30000);
        ctx.clearRect(0, 0, defaults.canvasWidth, defaults.canvasHeight);
    },
}

export {
    utils
};