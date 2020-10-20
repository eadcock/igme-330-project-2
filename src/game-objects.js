class GameObject {
    constructor(ctx, x, y, vx, vy) {
        console.log('super');
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    draw() {
        ctx.save();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2, false);
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
        this.speed = 2;

    }

    update(walls) {
        let canMove = true;
        let futurePos = {
            x: this.x + this.vx * this.speed,
            y: this.y + this.vy * this.speed
        };
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
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
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

export {
    Player,
    Wall
};