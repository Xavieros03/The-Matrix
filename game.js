const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")


const startButton = document.getElementById("startButton")
function startGame() {
    
  
    ctx.fillStyle = "red";
    ctx.fillRect(50, 50, 100, 100);
  }
  
  startButton.addEventListener("click", startGame);

