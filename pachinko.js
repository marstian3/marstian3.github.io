const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 650;

const pegs = [];
const balls = [];
const gravity = 1.0;
const friction = 0.97;
let elapsedTime = 0;
const ballInterval = 2000; // 2 seconds in milliseconds
class Peg {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0000';
        ctx.fill();
        ctx.closePath();
    }
}

class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
    }
    handlePegCollisions() {
        for (let peg of pegs) {
            const dist = Math.hypot(this.x - peg.x, this.y - peg.y);
            if (dist < this.radius + peg.radius) {
                // Calculate the collision normal
                const dx = this.x - peg.x;
                const dy = this.y - peg.y;
                const len = Math.hypot(dx, dy);
                const nx = dx / len;
                const ny = dy / len;

                // Reflect the ball's velocity
                const dotProduct = this.dx * nx + this.dy * ny;
                this.dx -= 2 * dotProduct * nx;
                this.dy -= 2 * dotProduct * ny;
            }
        }
    }
    update() {
        this.dy += gravity;
        this.dx *= friction;
        this.dy *= friction;
        this.x += this.dx;
        this.y += this.dy;
        this.handlePegCollisions();
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.height) {
            this.dy = -this.dy;
        }

        for (let peg of pegs) {
            const dist = Math.hypot(this.x - peg.x, this.y - peg.y);
            if (dist - this.radius - peg.radius < 1) {
                this.dx = -this.dx;
                this.dy = -this.dy;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    }
}

function initPegs() {
    const rows = 8;
    const spacing = 50;
    const xOffset = (canvas.width - (rows * spacing)) / 2;

    for (let y = 1; y <= rows; y++) {
        const colsInRow = 2 + y; // Start with 3 pegs in the first row and add 1 peg per subsequent row
        const rowWidth = colsInRow * spacing; // Total width of the row
        const rowOffset = (canvas.width - rowWidth) / 2; // Offset to center the row

        for (let x = 1; x <= colsInRow; x++) {
            const pegX = rowOffset + (x - 0.5) * spacing; // Center the peg horizontally
            const pegY = y * spacing;
            pegs.push(new Peg(pegX, pegY));
        }
    }
}



function initBalls() {
    const ball = new Ball(canvas.width / 2, 25);
    balls.push(ball);
}

function releaseBall() {
    balls.push(new Ball(canvas.width / 2, 25));
}

setInterval(releaseBall, 1455);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let peg of pegs) {
        peg.draw();
    }
    for (let ball of balls) {
        ball.update();
        ball.draw();
    }
    requestAnimationFrame(animate);
}

initPegs();
initBalls();
animate();

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    balls.push(new Ball(x, y));
});
