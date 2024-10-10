import Ground from "./ground/ground.js";
import Dino from "./dino/dino.js";
import Obstacle from "./obstacle/obstacle.js";
import ObstacleController from "./obstacle/controller.js";
import Score from "./score/Score.js";
import { createPlayerForm } from './nameForm.js'; 
import { sendScore } from './scoreManager.js';
import {displayScores} from './leaderboard.js';
import { GAME_WIDTH, GAME_HEIGHT, GAME_SPEED, GROUND_WIDTH, GROUND_HEIGHT, BACKGROUND_HEIGHT, DINO_WIDTH, DINO_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, OBSTACLES_NUMBER, BACKGROUND_SPEED } from "./constants.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let scaleRatio = 1;
let previousTime = null;
let notStarted = true;
let gameOver = false;
let ground = null;
let background = null;
let dino = null;
let obstacle = null;
let obstaclecontroller = null;
let gameSpeed = GAME_SPEED;
let eventListenerReset = false;
let score = null;
let scoreSent = false;
let playerName = "";
let nameTaken = false;
let formContainer;

window.onload = function() {
  formContainer = createPlayerForm();
  document.body.appendChild(formContainer);
  const form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    playerName = document.getElementById("playerName").value;
    nameTaken = true;
    formContainer.style.display = "none";
    resetEventListeners();
  });
};

export function setScreenSize() {
  scaleRatio = setScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  objectOnHomeScreen();
}

let groundImage = new Image();
groundImage.src = "./ground/ground.png";
let backgroundImage = new Image();
backgroundImage.src = "./background/background.png";

export async function initializeGame() {
  await backgroundImage.decode();
  setScreenSize();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => setTimeout(setScreenSize, 500));

export function setScaleRatio() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

export function showStartGame(ctx, canvas, scaleRatio) {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "black";
  const text = "Press Space To Start";
  const textWidth = ctx.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;
  const y = (canvas.height + fontSize) / 2;

  ctx.fillText(text, x, y);
}


export function objectOnHomeScreen() {
  const groundWidth = GROUND_WIDTH * scaleRatio;
  const groundHeight = GROUND_HEIGHT * scaleRatio;
  const backgroundHeight = BACKGROUND_HEIGHT * scaleRatio;
  const backgroundWidth = backgroundHeight / backgroundImage.height * backgroundImage.width;

  ground = new Ground(ctx, groundWidth, groundHeight, scaleRatio, groundImage);
  background = new Ground(ctx, backgroundWidth, backgroundHeight, scaleRatio, backgroundImage);
  dino = new Dino(ctx, DINO_WIDTH, DINO_HEIGHT, scaleRatio);
  obstacle = new Obstacle(ctx, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, scaleRatio, 0, 0, OBSTACLES_NUMBER);
  obstaclecontroller = new ObstacleController(ctx, scaleRatio, GAME_SPEED);
  score = new Score(ctx, scaleRatio);
}

function reset() {
  scoreSent = false;
  notStarted = false;
  obstacle.x = -canvas.width;
  gameOver = false;
  eventListenerReset = false;
  ground.reset();
  score.reset();
  const leaderboardContainer = document.getElementById('leaderboardContainer');
  if (leaderboardContainer) {
    document.body.removeChild(leaderboardContainer);
  }
}

function resetEventListeners() {
  if (!eventListenerReset) {
    eventListenerReset = true;
    setTimeout(() => {
      addGameEventListeners();
    }, 1000);
  }
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime;

  updateEntities(frameTimeDelta);
  checkCollisions();
  renderEntities();

  requestAnimationFrame(gameLoop);
}

function updateEntities(frameTimeDelta) {
  if (!notStarted && !gameOver && nameTaken) {
    background.update(BACKGROUND_SPEED, frameTimeDelta);
    ground.update(gameSpeed, frameTimeDelta);
    dino.update(frameTimeDelta);
    obstaclecontroller.update(obstacle, gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
  }
}

function checkCollisions() {
  if (obstacle.collideWith(dino)) {
    gameOver = true;
    resetEventListeners();
    score.setHighScore();
  }
}

function renderEntities() {
  background.draw();
  ground.draw();
  dino.draw();
  obstacle.draw();
  score.draw();

  if (notStarted) {
    showStartGame(ctx, canvas, scaleRatio);
  }

  if (gameOver && !scoreSent) {
    const finalScore = Math.floor(score.score);
    sendScore(finalScore, playerName);
    scoreSent = true;
    displayScores(scaleRatio, canvas);
  }
}


initializeGame();

function addGameEventListeners() {
  window.addEventListener("keyup", (event) => {
    if (event.key === ' ') {
      reset();
    }
  }, { once: true });

  window.addEventListener("touchstart", reset, { once: true });
}
addGameEventListeners();