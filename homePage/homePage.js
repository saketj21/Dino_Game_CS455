import Ground from "../ground/ground.js";
import Dino from "../dino/dino.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const DINO_HEIGHT = 200;
const DINO_WIDTH = 200;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GAME_SPEED = 1.0;
const GAME_SPEED_INCREASE = 0.00001;

let scaleRatio=1;
let previousTime = null;
let notStarted = true;
let gameOver = false;
let ground = null;
let dino = null;
let gameSpeed = GAME_SPEED;


function setScreenSize() {
    scaleRatio = setScaleRatio();
    canvas.width=GAME_WIDTH*scaleRatio;
    canvas.height=GAME_HEIGHT*scaleRatio;
    objectOnHomeScreen();
}

setScreenSize();

function setScaleRatio() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
      } else {
        return screenHeight / GAME_HEIGHT;
      }
}

function showStartGame() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText("Tap Screen or Press Space To Start", x, y);
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "grey";
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText("GAME OVER", x, y);
}

function gameLoop(currentTime){
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;
  
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ground.draw();
  dino.draw()
  ground.update(gameSpeed, frameTimeDelta);

  if(notStarted){
    showStartGame();
  }

  if(gameOver){
    showGameOver();
  }

  requestAnimationFrame(gameLoop);

}

function objectOnHomeScreen() {
  const groundWidth=GROUND_WIDTH*scaleRatio;
  const groundHeight=GROUND_HEIGHT*scaleRatio;

  ground = new Ground(ctx, groundWidth, groundHeight, scaleRatio);

  dino = new Dino(ctx, DINO_WIDTH, DINO_HEIGHT, scaleRatio);
}

requestAnimationFrame(gameLoop);