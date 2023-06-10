
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
let obstacles = [];
const maxObstacles = 50; // Maximum number of obstacles
let obstacleSpeedRange = { min: -5, max: 5 }; // Range of obstacle speeds

const resetButton = document.getElementById("resetButton");
let showMessage = false;


const startButton = document.getElementById("startButton");

let directions = {
  left: false,
  right: false,
  up: false,
  down: false,
};

let counter = 0;
let highScore = localStorage.getItem("highScore") || 0;



function initializeLevel() {
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
  ctx.fillStyle = "blue";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function drawGreenBox() {
  ctx.fillStyle = "green";
  if (!greenBox.collected) {
    ctx.fillRect(greenBox.x, greenBox.y, greenBoxWidth, greenBoxHeight);
  }
}

function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach((obstacle) => {
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacleRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  });
}

function handleKeyDown(event) {
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
    case "Enter":
      resetButtonClick();
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
  }
}

function updatePlayerPosition() {
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

function drawMessage() {
  if (showMessage) {
    ctx.fillStyle = "Black";
    ctx.font = "48px VT323";
    ctx.fillText("Congratulations! New High Score: " + highScore, canvas.width / 2 - 330, canvas.height / 1.5);
    resetButton.style.display = "block";
  } else {
    resetButton.style.display = "none";
  }
}

function resetButtonClick() {
  resetButton.style.display = "none";
  resetGameAfterMessage();
}

resetButton.addEventListener("click", resetButtonClick);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  ctx.fillStyle = "black";
  ctx.font = "24px VT323";
  ctx.fillText("Counter: " + counter, 10, 30);
  ctx.fillText("High Score: " + highScore, 150, 30);

  drawMessage();
  drawPlayer();
  drawGreenBox();
  drawObstacles();
  checkCollision();
}

function update() {
  updatePlayerPosition();
  updateObstacles();
  draw();
  requestAnimationFrame(update);
}

let gameStarted = false;
let animationFrameId = null;

function resetGame() {
  if (counter > highScore) {
    highScore = counter;
    showMessage = true;
    localStorage.setItem("highScore", highScore); 
  }
   // Reset player position
   playerX = canvas.width / 2 - playerWidth / 2;
   playerY = canvas.height / 2 - playerHeight / 2;
   // Reset player velocity
   playerVelocityX = 0;
   playerVelocityY = 0;
   // Reset Counter
   counter = 0;
   // Reset obstacles
   obstacles = [];
   // Add event listeners
   document.addEventListener("keydown", handleKeyDown);
   document.addEventListener("keyup", handleKeyUp);
   gameStarted = false;
 }
  



function resetGameAfterMessage() {
  showMessage = false;
  resetGame();
}

function startGame() {
  if (gameStarted) {
    resetGameAfterMessage(); // Restart the game
  }
  

  // Add event listeners
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  // Start the game loop
  if (!animationFrameId) {
    initializeLevel();
    animationFrameId = requestAnimationFrame(update);
    draw();
  }

  gameStarted = true;
}

startButton.addEventListener("click", startGame);
resetGame()




