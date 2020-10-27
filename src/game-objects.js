import { utils } from './utils.js';
import * as audio from './audio.js';
import { canvasWidth, canvasHeight } from './main.js';

class GameObject {
    constructor(ctx, x = 0, y = 0, vx = 0, vy = 0) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 1;
    }

    draw() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.w ?? 5, this.h ?? 5);
        this.ctx.restore();
    }

    testCollision(a, b) {
        let aTop = a.y,
            aLeft = a.x,
            aBottom = a.y + (a.h ?? 0),
            aRight = a.x + (a.w ?? 0);
        let bTop = b.y,
            bLeft = b.x,
            bBottom = b.y + (b.h ?? 0),
            bRight = b.x + (b.w ?? 0);
        return !(bLeft > aRight ||
            bRight < aLeft ||
            bTop > aBottom ||
            bBottom < aTop);
    }
}

class Rectangle extends GameObject {
    constructor(ctx, x = 0, y = 0, w = 0, h = 0) {
        super(ctx, x, y);
        this.w = w;
        this.h = h;
    }

    draw() {
        super.draw();
    }
}


let offset = 1;
let index = 0;
class Wall extends GameObject {
    constructor(ctx, x, y, w, h) {
        super(ctx, x, y, 0, 1);
        this.w = w;
        this.h = h;
        this.sliceWidth = 5;
    }

    draw(audioData, livingWalls) {
        if(livingWalls) {
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = 'white';
            let x = this.x, y = this.y;
            let w, h;
            let longSide = this.w > this.h ? this.w : this.h;
            if(this.w > this.h) {
                longSide = this.w;
                w = 5;
            } else {
                longSide = this.h;
                h = 5;
            }
            let slices = longSide / this.sliceWidth;
            let direction = 20;
            
            for(let i = 0; i < slices; i++) {
                if(longSide == this.w) {
                    h = utils.map(audioData[utils.bounce(index, [0, audioData.length - 1])], [0, 255], [2, 20]) / 2;
                    this.ctx.fillRect(x, y - h, this.sliceWidth, h * 2);
                    x += this.sliceWidth;
                } else {
                    w = utils.map(audioData[utils.bounce(index, [0, audioData.length - 1])], [0, 255], [1, 20]) / 2;
                    this.ctx.fillRect(x - w, y, w * 2, this.sliceWidth);
                    y += this.sliceWidth;
                }
    
                if(i + direction > audioData.length - 1) direction = -1;
                else if (i - direction < 0) direction = 1;
    
                index++;
            }
        } else {
            this.ctx.globalAlpha = 1;
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        
    }

    resetIndex() {
        index = 0;
    }
}

class Player extends GameObject {
    constructor(ctx, x, y, vx, vy) {
        super(ctx, x, y, vx, vy);
        this.speed = 1;
        this.initialX = x;
        this.initialY = y;
    }

    update(enemies, walls) {
        let canMove = true;
        let futurePos = {
            x: this.x + this.vx * this.speed,
            y: this.y + this.vy * this.speed
        };
        
        // check if colliding with enemies
        for (let i = 0; i < enemies.length; i++) {
            if (this.testCollision(futurePos, enemies[i])) {
                this.resetPosition();
                canMove = false;
                break;
            }
        }
        
        // check if colliding with walls
        for (let i = 0; i < walls.length; i++) {
            if (this.testCollision(futurePos, walls[i])) {
                canMove = false;
                break;
            }
        }

        if (canMove) {
            this.x = futurePos.x;
            this.y = futurePos.y;
        }
    }

    resetPosition() {
        this.x = this.initialX;
        this.y = this.initialY;
    }

    draw() {
        // draw player
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

        //this.drawIndicator(this.audioData, true);

        //draw indicator
        //this.drawIndicator(this.audioData);
    }

    drawIndicator(audioData, fill = false, reactive = false) {
        if(reactive) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.translate(this.x, this.y);
            this.ctx.strokeStyle = utils.makeColor(255, 255, 255, 1);
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            let angle = (Math.PI * 4) / audioData.length;
            let sampleRange = [-1, 1];
            let radiusRange = [10, 40];
            for(let i = 0; i < audioData.length; i += 2) {
                if(i == 0) {
                    this.ctx.moveTo(Math.cos(angle * i) * utils.map(audioData[i], sampleRange, radiusRange), Math.sin(angle * i) * utils.map(audioData[i], sampleRange, radiusRange));
                } else {
                    this.ctx.lineTo(Math.cos(angle * i) * utils.map(audioData[i], sampleRange, radiusRange), Math.sin(angle * i) * utils.map(audioData[i], sampleRange, radiusRange));
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        } else {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.translate(this.x, this.y);
            this.ctx.strokeStyle = utils.makeColor(255, 255, 255, 1);
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 25, 0, Math.PI * 2, false);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    clearLastIndicator() {
        if(this.lastIndicatorX && this.lastIndicatorY) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.beginPath();
            this.ctx.strokeStyle = utils.makeColor(0, 0, 0, 0.5);
            this.ctx.lineWidth = 5;
            this.ctx.arc(this.x, this.y, 20, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.restore();

        }
    }

    move(up, down, left, right) {
        if (up) {
            this.vy -= 1;
            if(this.vy < -1) this.vy = -1;
        }
        if (down) {
            this.vy += 1;
            if(this.vy > 1) this.vy = 1;
        }
        if (left) {
            this.vx -= 1;
            if(this.vx < -1) this.vx = -1;
        }
        if (right) {
            this.vx += 1;
            if(this.vx > 1) this.vx = 1;
        }
    }

    stop(up, down, left, right) {
        if(up) {
            this.vy += 1;
            if(this.vy > 1) this.vy = 1;
        }
        if(down) {
            this.vy -= 1;
            if(this.vy < -1) this.vy = -1;
        }
        if(left) {
            this.vx += 1;
            if(this.vx > 1) this.vx = 1;
        }
        if(right) {
            this.vx -= 1;
            if(this.vx < -1) this.vx = -1;
        }
    }
}

class BeatCone extends GameObject {
    constructor(ctx, x, y, maxRadius = 150, speed = 2) {
        super(ctx, x, y, 0, 0);
        this.radius = 20;
        this.maxRadius = maxRadius;
        this.speed = speed;
    }

    update(now) {
        let elapsedTime = now - this.creationTime;
        if(this.radius >= this.maxRadius) {
            return true;
        }

        this.radius += this.speed;
        this.drawVision();
    }

    drawVision() {
        this.ctx.globalCompositeOperation = 'xor';
        this.ctx.beginPath();
        // ctx.strokeStyle = utils.makeColor(255, 0, 255, 0.9);
        // ctx.lineWidth = 4;
        let gradient = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0.8, 'rgba(0, 0, 0, 255)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawOutline() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.beginPath();
        this.ctx.strokeStyle = utils.makeColor(255, 255, 255, 0.1);
        this.ctx.lineWidth = 4;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, true);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}

class Enemy extends GameObject {
    constructor(ctx, movePath) {
        super(ctx);
        this.w = 30;
        this.h = 30;
        this.speed = 1;
        this.movePath = movePath;
        this.currentPos = 0;
        this.x = movePath[this.currentPos].x;
        this.y = movePath[this.currentPos].y;
    }
    
    update() {
        // update pos
        this.vx = 0;
        this.vy = 0;
        if (this.x > this.movePath[this.currentPos].x) {
            this.vx = -1; // go left
        } else if (this.x < this.movePath[this.currentPos].x) {
            this.vx = 1; // go right
        } else if (this.y > this.movePath[this.currentPos].y) {
            this.vy = -1; // go up
        } else if (this.y < this.movePath[this.currentPos].y) {
            this.vy = 1; // go down
        }
        
        // apply changes
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
        
        // check pos
        // update currentPos if needed
        if (this.movePath[this.currentPos].x == this.x && this.movePath[this.currentPos].y == this.y) {
            this.currentPos++;
            
            if (this.currentPos == this.movePath.length) {
                this.currentPos = 0;
            }
        }
        
        this.draw();
    }
    
    draw() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }
}

export {
    Player,
    Wall,
    BeatCone,
    Enemy,
    Rectangle
};