const gameName = document.getElementById("gameName");
const menu = document.getElementById("menu");
const messages = document.getElementById("messages");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// player related variables
const playerWidth = 30;
const playerHeight = 30;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height / 2 - playerHeight / 2;
let playerVelocityX = 0;
let playerVelocityY = 0;
let playerSpeed = 7;

// playing ground related variables
const boxWidth = 1400;
const boxHeight = 700;
const boxX = (canvas.width - boxWidth) / 2;
const boxY = (canvas.height - boxHeight) / 2;

// collectible related variables
const greenBoxWidth = 30;
const greenBoxHeight = 30;
let greenBox = null;

// obstacle related variables
const obstacleRadius = 15;
let obstacles = [1];
const maxObstacles = 50; // Maximum number of obstacles
let obstacleSpeedRange = { min: -5, max: 5 }; // Range of obstacle speeds

let gameOver = false;
const startButton = document.getElementById("startButton");

let directions = {
  left: false,
  right: false,
  up: false,
  down: false,
};

const STORAGE_KEY = "highScore"
let counter = 0;
let highScore = localStorage.getItem(STORAGE_KEY) || 0;

function initializeLevel() {
  canvas.style.display = "block";

  // Initialize player position
  playerX = boxX;
  playerY = boxY + boxHeight / 2 - playerHeight / 2;
  playerVelocityX = 0;
  playerVelocityY = 0;

  // Generate a new green box
  const randomX = Math.random() * (boxWidth - greenBoxWidth) + boxX;
  const randomY = Math.random() * (boxHeight - greenBoxHeight) + boxY;
  greenBox = {
    x: randomX,
    y: randomY,
    collected: false,
  };
}

function generateObstacle() {
  if (obstacles.length < maxObstacles) {
    const randomX = Math.random() * (boxWidth - obstacleRadius * 2) + boxX + obstacleRadius;
    const randomY = Math.random() * (boxHeight - obstacleRadius * 2) + boxY + obstacleRadius;
    const randomSpeedX = (Math.random() * (obstacleSpeedRange.max - obstacleSpeedRange.min) + obstacleSpeedRange.min);
    const randomSpeedY = (Math.random() * (obstacleSpeedRange.max - obstacleSpeedRange.min) + obstacleSpeedRange.min);
    obstacles.push({ x: randomX, y: randomY, speedX: randomSpeedX, speedY: randomSpeedY });
  }
}

function drawPlayer() {
  ctx.fillStyle = "#03A062";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawRedBox() {
  ctx.fillStyle = "#D92121";
  if (!greenBox.collected) {
    ctx.fillRect(greenBox.x, greenBox.y, greenBoxWidth, greenBoxHeight);
  }
}

function drawObstacles() {
  ctx.fillStyle = "#0065ff";
  obstacles.forEach((obstacle) => {
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacleRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  });
}

function handleKeyDown(event) {
  if (!gameStarted || gameOver) {
    return; // Prevent player movement if the game has not started
  }
  switch (event.key) {
    case "ArrowLeft":
      directions.left = true;
      break;
    case "ArrowRight":
      directions.right = true;
      break;
    case "ArrowUp":
      directions.up = true;
      break;
    case "ArrowDown":
      directions.down = true;
      break;
    case "Escape":
      resetGame();
      break;
  }
}

function handleKeyUp(event) {
  switch (event.key) {
    case "ArrowLeft":
      directions.left = false;
      break;
    case "ArrowRight":
      directions.right = false;
      break;
    case "ArrowUp":
      directions.up = false;
      break;
    case "ArrowDown":
      directions.down = false;
      break;
    case "Enter":
      if(!gameStarted || gameOver) {
        startGame();
      }
      break;
  }
}

function updatePlayerPosition() {
  if (gameOver) {
    return; // Prevent updating player position if the game has ended
  }
  if (directions.left === true && playerX > boxX) {
    playerVelocityX = -playerSpeed;
  } else if (directions.right === true && playerX + playerWidth < boxX + boxWidth) {
    playerVelocityX = playerSpeed;
  } else {
    playerVelocityX = 0;
  }

  if (directions.up === true && playerY > boxY) {
    playerVelocityY = -playerSpeed;
  } else if (directions.down === true && playerY + playerHeight < boxY + boxHeight) {
    playerVelocityY = playerSpeed;
  } else {
    playerVelocityY = 0;
  }

  playerX += playerVelocityX;
  playerY += playerVelocityY;
}

function updateObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.x += obstacle.speedX;
    obstacle.y += obstacle.speedY;

    if (obstacle.x + obstacleRadius > boxX + boxWidth || obstacle.x - obstacleRadius < boxX) {
      obstacle.speedX *= -1;
    }

    if (obstacle.y + obstacleRadius > boxY + boxHeight || obstacle.y - obstacleRadius < boxY) {
      obstacle.speedY *= -1;
    }

    if (
      playerX < obstacle.x + obstacleRadius &&
      playerX + playerWidth > obstacle.x - obstacleRadius &&
      playerY < obstacle.y + obstacleRadius &&
      playerY + playerHeight > obstacle.y - obstacleRadius
    ) {
      // Collision with obstacle
      resetGame();
    }
  });
}

function checkCollision() {
  if (
    !greenBox.collected &&
    playerX < greenBox.x + greenBoxWidth &&
    playerX + playerWidth > greenBox.x &&
    playerY < greenBox.y + greenBoxHeight &&
    playerY + playerHeight > greenBox.y
  ) {
    greenBox.collected = true;
    counter++;
    if (counter % 10 === 0) {
      // Generate new obstacles if the counter reaches multiples of 10
      generateObstacle();
    }
    if(counter === 1){
      generateObstacle();
    }
    // Generate a new green box
    const randomX = Math.random() * (boxWidth - greenBoxWidth) + boxX;
    const randomY = Math.random() * (boxHeight - greenBoxHeight) + boxY;
    greenBox = {
      x: randomX,
      y: randomY,
      collected: false,
    };
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgb(18, 18, 18)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  ctx.fillStyle = "white";
  ctx.font = "24px VT323";
  ctx.fillText("Counter: " + counter, 10, 30);
  ctx.fillText("High Score: " + highScore, 150, 30);

  drawPlayer();
  drawRedBox();
  drawObstacles();
  checkCollision();
}

function update() {
  updatePlayerPosition();
  updateObstacles();
  draw();
  if(gameStarted) {
    requestAnimationFrame(update);
  }
}

let gameStarted = false;

function resetGame() {
  if (counter > highScore) {
    highScore = counter;
    messages.innerHTML =`New HighScore = ${highScore}`;
    messages.style.color = "red"
    messages.style.fontSize = "45px"
    localStorage.setItem(STORAGE_KEY, highScore); 
  } else {
    messages.innerHTML = "Game Over";
    messages.style.color = "#0065ff"
  }
  gameOver = !gameOver;
   // Reset player position
   playerX = boxX;
   playerY = boxY + (boxHeight - playerHeight) / 2;
   // Reset player velocity
   playerVelocityX = 0;
   playerVelocityY = 0;
   // Reset Counter
   counter = 0;
   // Reset obstacles
   obstacles = [1];
   if(gameOver) {
    canvas.style.display = "none";
    menu.style.display = "flex";
   } else {
    canvas.style.display = "block";
    menu.style.display = "none";
   }

 }

function startGame() {
  if(gameStarted){
    messages.innerHTML = ""
    resetGame()
  }  else {
    gameStarted = true;
    gameOver = false;
    // Start the game loop
    initializeLevel();
    requestAnimationFrame(update);
    draw();
  }
  menu.style.display = "none"
}
  
// Add event listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

startButton.addEventListener("click", startGame);

const instructions = document.getElementById("instructions")
function toggleInstructions() {
  if (instructions.style.display === "block") {
    instructions.style.display = "none"
  } else {
    instructions.style.display = "block"
  }
}