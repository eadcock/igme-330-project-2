class Player {
    constructor(x, y) {
        this.position = {
            x: x,
            y: y
        };
        this.speed = 2;
        this.direction = {x: 0, y: 0};
    }

    update(ctx) {
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
        
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(this.position.x,this.position.y, 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
    }

    move(up, down, left, right) {
        this.direction.y = up ? -1 : down ? 1 : 0;
        this.direction.x = left ? -1 : right ? 1 : 0;
    }

    stop(up, down, left, right) {
        if(up || down) this.direction.y = 0;
        if(left || right) this.direction.x = 0;
    }
}