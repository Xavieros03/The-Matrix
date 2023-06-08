const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")

//player related variables

const playerWidth = 20
const playerHeight = 20
let playerX = canvas.width / 2 - playerWidth / 2
let playerY = canvas.height / 2 - playerHeight / 2

//playing ground related variables

const boxWidth = 1400
const boxHeight = 700
const boxX = (canvas.width - boxWidth) / 2
const boxY = (canvas.height - boxHeight) / 2


const startButton = document.getElementById("startButton")
function startGame() {
    
  
  function drawPlayer() {
    ctx.fillStyle = "blue"
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight)
  }
 
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  
    ctx.strokeStyle = "black"
    ctx.lineWidth = 4
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)
  
    drawPlayer()
    
  }
  draw()
}
  
  startButton.addEventListener("click", startGame)

