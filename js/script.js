const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('gameOverMessage');
const finalScore = document.getElementById('finalScore');

let snake = [
    {x: 150, y: 150},
    {x: 140, y: 150},
    {x: 130, y: 150},
    {x: 120, y: 150},
    {x: 110, y: 150}
];

let dx = 10;
let dy = 0;
let changingDirection = false;
let foodX;
let foodY;
let score = 0;
let gameInterval;

function startGame() {
    startBtn.style.display = 'none';
    restartBtn.style.display = 'block';
    gameOverMessage.style.display = 'none';
    resetGame();
    gameInterval = setInterval(main, 100);
}

function resetGame() {
    snake = [
        {x: 150, y: 150},
        {x: 140, y: 150},
        {x: 130, y: 150},
        {x: 120, y: 150},
        {x: 110, y: 150}
    ];
    dx = 10;
    dy = 0;
    changingDirection = false;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    createFood();
}

function main() {
    if (didGameEnd()) {
        clearInterval(gameInterval);
        gameOverMessage.style.display = 'block';
        finalScore.textContent = 'Your score: ' + score;
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#000';

    ctx.beginPath();
    ctx.arc(snakePart.x + 5, snakePart.y + 5, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function advanceSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = 'Score: ' + score;
        createFood();
    } else {
        snake.pop();
    }
}

function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > canvas.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > canvas.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function createFood() {
    foodX = Math.round((Math.random() * (canvas.width - 10) / 10)) * 10;
    foodY = Math.round((Math.random() * (canvas.height - 10) / 10)) * 10;

    snake.forEach(function isFoodOnSnake(part) {
        const foodIsOnSnake = part.x == foodX && part.y == foodY;
        if (foodIsOnSnake) createFood();
    });
}

function drawFood() {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(foodX, foodY, 10, 10);
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    clearInterval(gameInterval);
    resetGame();
    gameInterval = setInterval(main, 100);
});
