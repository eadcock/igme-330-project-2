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
        ctx.save();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.restore();
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

class Wall extends GameObject {
    constructor(ctx, x, y, w, h) {
        super(ctx, x, y, 0, 1);
        this.w = w;
        this.h = h;
    }

    draw() {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Player extends GameObject {
    constructor(ctx, x, y, vx, vy) {
        super(ctx, x, y, vx, vy);
        this.speed = 1;
        this.audioData = new Float32Array(audio.analyserNode.fftSize);
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
                this.x = this.initialX;
                this.y = this.initialY;
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

        this.draw();
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

        this.drawIndicator(this.audioData, true);

        audio.analyserNode.getFloatTimeDomainData(this.audioData);
        //draw indicator
        this.drawIndicator(this.audioData);
    }

    drawIndicator(audioData, clear = false) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.translate(this.x, this.y);
        this.ctx.strokeStyle = clear ? 'black' : utils.makeColor(255, 255, 255, 0.2);
        this.ctx.lineWidth = clear ? 10 : 1;
        this.ctx.beginPath();
        let angle = (Math.PI * 4) / this.audioData.length;
        let sampleRange = [-1, 1];
        let radiusRange = [10, 40];
        for(let i = 0; i < this.audioData.length; i += 2) {
            let mappedValue = utils.map(this.audioData[i], [0, 255], [0, canvasHeight]);
            let padding = 3;
            if(i == 0) {
                this.ctx.moveTo(Math.cos(angle * i) * utils.map(this.audioData[i], sampleRange, radiusRange), Math.sin(angle * i) * utils.map(this.audioData[i], sampleRange, radiusRange));
            } else {
                this.ctx.lineTo(Math.cos(angle * i) * utils.map(this.audioData[i], sampleRange, radiusRange), Math.sin(angle * i) * utils.map(this.audioData[i], sampleRange, radiusRange));
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
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
            this.vy = -1;
        }
        if (down) {
            this.vy = 1;
        }
        if (left) {
            this.vx = -1;
        }
        if (right) {
            this.vx = 1;
        }
    }

    stop(up, down, left, right) {
        if (up || down) this.vy = 0;
        if (left || right) this.vx = 0;
    }
}

class BeatCone extends GameObject {
    constructor(ctx, x, y, maxRadius = 78, speed = 2) {
        super(ctx, x, y, 0, 0);
        this.radius = 20;
        this.maxRadius = maxRadius;
        this.speed = speed;
    }

    update(now) {
        let elapsedTime = now - this.creationTime;
        if(this.radius >= this.maxRadius) {
            console.log('delete');
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
    Enemy
};