const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

// player related variables
const playerWidth = 20
const playerHeight = 20
let playerX = canvas.width / 2 - playerWidth / 2
let playerY = canvas.height / 2 - playerHeight / 2
const playerSpeed = 8

// playing ground related variables
const boxWidth = 1400
const boxHeight = 700
const boxX = (canvas.width - boxWidth) / 2
const boxY = (canvas.height - boxHeight) / 2

//collectible related variables

const greenBoxWidth = 30
const greenBoxHeight = 30
let greenBox = null

const startButton = document.getElementById("startButton")

let directions = {
  left: false,
  right: false,
  up: false,
  down: false
};
function initializeLevel() {
  // Initialize player position
  playerX = boxX;
  playerY = boxY + boxHeight / 2 - playerHeight / 2

  // Generate a new green box
  const randomX = Math.random() * (boxWidth - greenBoxWidth) + boxX
  const randomY = Math.random() * (boxHeight - greenBoxHeight) + boxY
  greenBox = {
    x: randomX,
    y: randomY,
    collected: false
  }
}

function drawPlayer() {
  ctx.fillStyle = "blue"
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight)
}
function drawGreenBox() {
  ctx.fillStyle = "green";
  if (!greenBox.collected) {
    ctx.fillRect(greenBox.x, greenBox.y, greenBoxWidth, greenBoxHeight);
  }
}

function handleKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
      directions.left = true
      break;
    case "ArrowRight":
      directions.right = true
      break;
    case "ArrowUp":
      directions.up = true
      break;
    case "ArrowDown":
      directions.down = true
      break;
  }
}

function handleKeyUp(event) {
  switch (event.key) {
    case "ArrowLeft":
      directions.left = false
      break;
    case "ArrowRight":
      directions.right = false
      break;
    case "ArrowUp":
      directions.up = false
      break;
    case "ArrowDown":
      directions.down = false
      break;
  }
}

function updatePlayerPosition() {
  if (directions.left === true && playerX > boxX) {
    playerX -= playerSpeed
  } else if (directions.right === true && playerX + playerWidth < boxX + boxWidth) {
    playerX += playerSpeed
  } else if (directions.up === true && playerY > boxY) {
    playerY -= playerSpeed
  } else if (directions.down === true && playerY + playerHeight < boxY + boxHeight) {
    playerY += playerSpeed
  }
}
function checkCollision() {
  if (
    !greenBox.collected &&
    playerX < greenBox.x + greenBoxWidth &&
    playerX + playerWidth > greenBox.x &&
    playerY < greenBox.y + greenBoxHeight &&
    playerY + playerHeight > greenBox.y
  ) {
    greenBox.collected = true

    } if (greenBox.collected === true) {
      // Generate a new green box
      const randomX =
        Math.random() * (boxWidth - greenBoxWidth) + boxX;
      const randomY =
        Math.random() * (boxHeight - greenBoxHeight) + boxY;
      greenBox = {
        x: randomX,
        y: randomY,
        collected: false
      };
    }
  }

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = "black"
  ctx.lineWidth = 4
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

  drawPlayer()
  drawGreenBox()
  checkCollision()
}

function update() {
  updatePlayerPosition()
  draw()
  requestAnimationFrame(update)
}

function startGame() {
  // Reset player position
  playerX = canvas.width / 2 - playerWidth / 2
  playerY = canvas.height / 2 - playerHeight / 2
  // Add event listeners
  document.addEventListener("keydown", handleKeyDown)
  document.addEventListener("keyup", handleKeyUp)
  // Start the game loop
  initializeLevel()
  draw()
  update()
}

startButton.addEventListener("click", startGame)


