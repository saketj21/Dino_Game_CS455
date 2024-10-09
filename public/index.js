import Ground from "./ground/ground.js";
import Dino from "./dino/dino.js";
import Obstacle from "./obstacle/obstacle.js";
import ObstacleController from "./obstacle/controller.js";
import Score from "./score/Score.js";
import { createPlayerForm } from './nameForm.js'; 
import { fetchScores, sendScore } from './scoreManager.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const DINO_HEIGHT = 100;
const DINO_WIDTH = 100;
const OBSTACLE_WIDTH = 100;
const OBSTACLE_HEIGHT = 100;
const GROUND_WIDTH = 1000;
const GROUND_HEIGHT = 24;
const BACKGROUND_HEIGHT = GAME_HEIGHT;
const BACKGROUND_SPEED = 0.1;
const GAME_SPEED = 1.0;
const OBSTACLES_NUMBER = 5;

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

function setScreenSize() {
  scaleRatio = setScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  objectOnHomeScreen();
}

let groundImage = new Image();
groundImage.src = "./ground/ground.png";
let backgroundImage = new Image();
backgroundImage.src = "./background/background.png";

async function initializeGame() {
  await backgroundImage.decode();
  setScreenSize();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", () => setTimeout(setScreenSize, 500));

function setScaleRatio() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

export function showStartGame() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "black";
  const text = "Press Space To Start";
  const textWidth = ctx.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;
  const y = (canvas.height + fontSize) / 2;

  ctx.fillText(text, x, y);
}

// eslint-disable-next-line max-statements
async function displayScores() {

  let leaderboardContainer = document.createElement('div');
  leaderboardContainer.id = 'leaderboardContainer';
  leaderboardContainer.style.position = 'absolute';
  leaderboardContainer.style.top = window.height/2-canvas.height/2 + 'px';
  leaderboardContainer.style.left = '0';
  leaderboardContainer.style.width = canvas.width + 'px';
  leaderboardContainer.style.height = canvas.height + 'px';
  leaderboardContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  leaderboardContainer.style.border = '2px solid black';
  leaderboardContainer.style.padding = '20px';
  leaderboardContainer.style.zIndex = '1000';
  leaderboardContainer.style.textAlign = 'center';
  leaderboardContainer.style.fontFamily = 'Verdana, sans-serif';
  leaderboardContainer.style.fontSize = `${18 * scaleRatio}px`;
  leaderboardContainer.style.display = 'flex';
  leaderboardContainer.style.flexDirection = 'column';
  leaderboardContainer.style.justifyContent = 'center';
  leaderboardContainer.style.alignItems = 'center';
  
  const title = document.createElement('h2');
  title.textContent = 'Leaderboard';
  title.style.marginBottom = '5%';
  leaderboardContainer.appendChild(title);
  
  const leaderboardTable = document.createElement('table');
  leaderboardTable.style.margin = '0 auto';
  leaderboardTable.style.borderCollapse = 'collapse';
  leaderboardTable.style.width = '100%';
  leaderboardTable.style.height = "83%";
  
  const tableHeader = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Rank', 'Name', 'Score'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    th.style.border = '1px solid black';
    th.style.padding = '10px';
    th.style.backgroundColor = '#f2f2f2';
    headerRow.appendChild(th);
  });
  tableHeader.appendChild(headerRow);
  leaderboardTable.appendChild(tableHeader);
  
  const tableBody = document.createElement('tbody');
  // Add rows to the table body as needed
  leaderboardTable.appendChild(tableBody);
  
  leaderboardContainer.appendChild(leaderboardTable);
  document.body.appendChild(leaderboardContainer);

  const scores = await fetchScores();
  tableBody.innerHTML = ''; 

  scores.forEach((score, index) => {
    const row = document.createElement('tr');

    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1;

    const nameCell = document.createElement('td');
    nameCell.textContent = score.name;

    const scoreCell = document.createElement('td');
    scoreCell.textContent = score.score;

    row.appendChild(rankCell);
    row.appendChild(nameCell);
    row.appendChild(scoreCell);

    tableBody.appendChild(row);
  });
}

function objectOnHomeScreen() {
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
      window.addEventListener("keyup", (event) => {
        if (event.key === ' ') {
          reset();
        }
      }, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
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

  background.draw();
  ground.draw();
  dino.draw();
  obstacle.draw();
  score.draw();

  if (!notStarted && !gameOver && nameTaken) {
    background.update(BACKGROUND_SPEED, frameTimeDelta);
    ground.update(gameSpeed, frameTimeDelta);
    dino.update(frameTimeDelta);
    obstaclecontroller.update(obstacle, gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
  }

  if (obstacle.collideWith(dino)) {
    gameOver = true;
    resetEventListeners();
    score.setHighScore();
  }

  if (notStarted) {
    showStartGame();
  }

  if (gameOver) {
    if(!scoreSent){
      const finalScore = Math.floor(score.score);
      sendScore(finalScore, playerName);
      scoreSent = true;
      displayScores();
    }

  }

  requestAnimationFrame(gameLoop);
}

initializeGame();

window.addEventListener("keyup", (event) => {
  if (event.key === ' ') {
    reset();
  }
}, { once: true });

window.addEventListener("touchstart", reset, { once: true });