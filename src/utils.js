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
        getRandomColor(alpha = drawParams.defaultAlpha) {
            const getByte = _ => drawParams.colorRange.min + Math.round(Math.random() * (drawParams.colorRange.max -
                drawParams.colorRange.min));
            return `rgba(${getByte()},${getByte()},${getByte()},${alpha})`;
        },
    },
    
    draw: {
        randomRect(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(random.getRandomInt(0, canvasWidth), random.getRandomInt(0, canvasHeight),
            random.getRandomInt(drawParams.rectSpan.min, drawParams.rectSpan.max),
            random.getRandomInt(drawParams.rectSpan.min, drawParams.rectSpan.max));
            ctx.closePath();
            ctx.strokeStyle = random.getRandomColor();
            ctx.fillStyle = random.getRandomColor();
            ctx.lineWidth = random.getRandomInt(drawParams.strokeWidth.min, drawParams.strokeWidth.max);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },
        randomCircle(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(random.getRandomInt(0, canvasWidth), random.getRandomInt(0, canvasHeight), random.getRandomInt(drawParams.circleRadius
                .min,
                drawParams.circleRadius.max), 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = random.getRandomColor();
            ctx.fill();
            ctx.restore();
        },
        randomLine(ctx) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight));
            ctx.lineTo(getRandomInt(0, canvasWidth), getRandomInt(0, canvasHeight));
            ctx.closePath();
            ctx.strokeStyle = random.getRandomColor();
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
        ctx.clearRect(0, 0, canvasHeight, canvasWidth);
    },
}

export { utils };