import { utils } from "./utils.js";
import { Wall } from "./game-objects.js";

const dir = {
    N: [0, -1],
    S: [0, 1],
    E: [1, 0],
    W: [-1, 0]
}

const dirOpposite = {
    N: 'S',
    S: 'N',
    E: 'W',
    W: 'E'
}

class Maze {
    constructor(ctx, walls, canvasWidth, canvasHeight, mazeWidth, mazeHeight) {
        this.width = mazeWidth;
        this.height = mazeHeight;
        this.setUpGrid();
        this.build(ctx, walls, canvasWidth, canvasHeight);
    }

    setUpGrid() {
        this.grid = new Array();
        for(let i = 0; i < this.height; i++) {
            this.grid.push(new Array());
            for(let j = 0; j < this.width; j++) {
                this.grid[i].push(new Cell(j, i, true, true, true, true));
            }
        }
    }

    build(ctx, walls, canvasWidth, canvasHeight) {
        let cells = [];
        cells.push(this.grid[utils.random.getRandomInt(0, this.height - 1)][utils.random.getRandomInt(0, this.width - 1)]);
        cells[0].visited = true;
        while(cells.length > 0) {
            let index = this.chooseIndex(cells.length);
            let cell = cells[index];

            
            let directions = ['N', 'S', 'E', 'W'];
            utils.shuffle(directions);
            while(directions.length > 0) {
                let neighbor = this.getNeighbor(cell, dir[directions.pop()]);
                if(neighbor && !neighbor.visited) {
                    this.connectCells(cell, neighbor);
                    cells.push(neighbor);
                    neighbor.visited = true;
                    break;
                }
            }

            if(directions.length == 0) cells.splice(index, 1);
        }

        let cellWidth = canvasWidth / this.width;
        let cellHeight = canvasHeight / this.height;

        for(let row of this.grid) {
            for(let cell of row) {
                let x = cell.x * cellWidth;
                let y = cell.y * cellHeight;
                if(cell.walls.N) {
                    walls.push(new Wall(ctx, x, y, cellWidth, 5));
                }
                if(cell.walls.S) {
                    walls.push(new Wall(ctx, x, y + cellHeight, cellWidth, 5));
                }
                if(cell.walls.E) {
                    walls.push(new Wall(ctx, x + cellWidth, y, 5, cellHeight));
                }
                if(cell.walls.W) {
                    walls.push(new Wall(ctx, x, y, 5, cellHeight));
                }
            }
        }
    }

    chooseIndex(max, how = 'chooseNewest') {
        switch(how) {
            case 'random':
                return utils.random.getRandomInt(0, max);
            default:
                return max - 1;
                break;
        }
    }

    

    draw(ctx, canvasHeight, canvasWidth) {
        
    }

    getVisitableNeighbors(cell) {
        let neighbors = [];
        for(let wall of cell.walls) {
            const neighbor = this.getNeighbor(cell, wall);
            if(neighbor) neighbors.push();
        }
    }

    getNeighbor(cell, dir) {
        let nx = cell.x + dir[0], ny = cell.y + dir[1];
        if(utils.isInRange(ny, [0, this.height - 1]) && utils.isInRange(nx, [0, this.width - 1])) 
            return this.grid[ny][nx];

        return 0;
    }

    connectCells(cell1, cell2) {
        let dir;
        let dx = cell1.x - cell2.x;
        let dy = cell1.y - cell2.y;
        if(dx != 0) {
            if(dx == 1) {
                dir = 'E';
            } else {
                dir = 'W';
            }
        } else {
            if(dy == 1) {
                dir = 'S';
            } else {
                dir = 'N';
            }
        }

        cell2.breakWall(dir);
        cell1.breakWall(dirOpposite[dir]);
    }
}

class Cell {
    constructor(x, y, north, south, east, west) {
        this.x = x;
        this.y = y;

        this.walls = {
            N: north,
            S: south,
            E: east,
            W: west
        }
        
    }

    getPassages() {
        const passages = [];
        for(let wall in this.walls) {
            if(!this.walls[wall]) passages.push(wall);
        }

        return passages;
    }

    breakWall(dir) {
        this.walls[dir] = false;
    }

    addWall(dir) {
        this.walls[dir] = true;
    }
}

export { Maze, Cell };