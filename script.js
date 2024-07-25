const board = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const boardSize = 400;
const snakeSize = 20;
const snakeSpeed = 200; // speed in milliseconds

let snake = [{ x: 200, y: 200 }];
let direction = 'RIGHT';
let food = { x: 60, y: 60 };
let score = 0;
let gameInterval;

function drawSnake() {
    board.innerHTML = ''; // Clear the board
    snake.forEach(segment => {
        const snakePart = document.createElement('div');
        snakePart.style.width = `${snakeSize}px`;
        snakePart.style.height = `${snakeSize}px`;
        snakePart.style.backgroundColor = 'green';
        snakePart.style.position = 'absolute';
        snakePart.style.left = `${segment.x}px`;
        snakePart.style.top = `${segment.y}px`;
        board.appendChild(snakePart);
    });
}

function drawFood() {
    const foodElement = document.createElement('div');
    foodElement.style.width = `${snakeSize}px`;
    foodElement.style.height = `${snakeSize}px`;
    foodElement.style.backgroundColor = 'red';
    foodElement.style.position = 'absolute';
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    board.appendChild(foodElement);
}

function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= snakeSize;
            break;
        case 'DOWN':
            head.y += snakeSize;
            break;
        case 'LEFT':
            head.x -= snakeSize;
            break;
        case 'RIGHT':
            head.x += snakeSize;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    if (isGameOver()) {
        clearInterval(gameInterval);
        alert('Game Over! Your score: ' + score);
    }

    updateScore();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * (boardSize / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (boardSize / snakeSize)) * snakeSize
    };
}

function isGameOver() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function updateGame() {
    drawSnake();
    drawFood();
    moveSnake();
}

function updateScore() {
    scoreElement.textContent = 'Score: ' + score;
}

function handleKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'DOWN') direction = 'UP';
            break;
        case 'ArrowDown':
            if (direction !== 'UP') direction = 'DOWN';
            break;
        case 'ArrowLeft':
            if (direction !== 'RIGHT') direction = 'LEFT';
            break;
        case 'ArrowRight':
            if (direction !== 'LEFT') direction = 'RIGHT';
            break;
    }
}

document.addEventListener('keydown', handleKeyDown);

generateFood();
gameInterval = setInterval(updateGame, snakeSpeed);
