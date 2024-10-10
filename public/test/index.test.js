import { setScaleRatio, showStartGame, initializeGame, setScreenSize, objectOnHomeScreen} from './../index.js';
import Ground from './../ground/ground.js';
import Dino from './../dino/dino.js';
import Obstacle from './../obstacle/obstacle.js';
import ObstacleController from './../obstacle/controller.js';
import Score from './../score/Score.js';
import { fetchScores } from './../scoreManager.js';
import { sendScore } from './../scoreManager.js';
import { displayScores } from './../leaderboard.js';

jest.mock('./../ground/ground.js');
jest.mock('./../dino/dino.js');
jest.mock('./../obstacle/obstacle.js');
jest.mock('./../obstacle/controller.js');
jest.mock('./../score/Score.js');

// eslint-disable-next-line max-lines-per-function
describe('Index Module', () => {
  let canvas, ctx, originalDocument;

  beforeEach(() => {
    originalDocument = global.document;
  
    // Create mock canvas
    canvas = {
      id: 'game',
      width: 800,
      height: 300,
      getContext: jest.fn(),
    };
  
    // Create mock context
    ctx = {
      fillText: jest.fn(),
      clearRect: jest.fn(),
      measureText: jest.fn(() => ({ width: 200 })),
      font: '',
      fillStyle: '',
    };
  
    // Mock getContext to return the mock ctx object
    canvas.getContext.mockReturnValue(ctx);
  
    // Mock document and getElementById
    global.document = {
      ...originalDocument,
      getElementById: jest.fn().mockReturnValue(canvas),
      createElement: jest.fn(() => ({
        style: {},
        addEventListener: jest.fn(),
        appendChild: jest.fn(),
      })),
      body: { 
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
    };
  
    global.Image = class {
      constructor() {
        setTimeout(() => this.onload && this.onload());
      }
    };
  
    global.requestAnimationFrame = jest.fn();
    
    // Mock setScreenSize globally
    global.setScreenSize = jest.fn();
  });

  afterEach(() => {
    global.document = originalDocument;
    jest.restoreAllMocks();
  });

  test('initializeGame function', async () => {
    await initializeGame();
    expect(global.requestAnimationFrame).toHaveBeenCalled();
  });

  test('setScreenSize function', () => {
    const scaleRatio = 2;
    global.objectOnHomeScreen = jest.fn();
    setScreenSize(canvas, scaleRatio);
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(300);
  });

  test('objectOnHomeScreen function', () => {
    global.Ground = Ground;
    global.Dino = Dino;
    global.Obstacle = Obstacle;
    global.ObstacleController = ObstacleController;
    global.Score = Score;
    objectOnHomeScreen();
    expect(Ground).toHaveBeenCalled();
    expect(Dino).toHaveBeenCalled();
    expect(Obstacle).toHaveBeenCalled();
    expect(ObstacleController).toHaveBeenCalled();
    expect(Score).toHaveBeenCalled();
  });

  test('displayScores function', async () => {
    const mockScores = [{ name: 'Player1', score: 100 }, { name: 'Player2', score: 200 }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockScores),
      })
    );
    let scaleRatio = 1;
    await displayScores(scaleRatio, canvas);
    expect(global.fetch).toHaveBeenCalled();
  });

  test('sendScore function', async () => {
    global.fetch = jest.fn(() => Promise.resolve());
    await sendScore(100, 'TestPlayer');
    expect(global.fetch).toHaveBeenCalledWith('/api/scores', expect.any(Object));
  });

  test('setScaleRatio should return correct scale ratio based on screen size', () => {
    // Mock window dimensions
    global.innerWidth = 1600;
    global.innerHeight = 900;

    // Act
    const scaleRatio = setScaleRatio();

    // Assert
    expect(scaleRatio).toBe(2); // Adjust based on your scaling logic
  });

  test('showStartGame should display start game text on canvas', () => {
    // Arrange
    const canvas = { width: 800, height: 300 };
    const ctx = {
      font: '',
      fillStyle: '',
      measureText: jest.fn(() => ({ width: 200 })),
      fillText: jest.fn()
    };
    const scaleRatio = 1;

    // Act
    showStartGame(ctx, canvas, scaleRatio);

    // Assert
    expect(ctx.font).toBe('40px Verdana');
    expect(ctx.fillStyle).toBe('black');
    expect(ctx.measureText).toHaveBeenCalledWith('Press Space To Start');
    expect(ctx.fillText).toHaveBeenCalledWith('Press Space To Start', 300, 170);
  });

  test('fetchScores should fetch scores from API', async () => {
    // Arrange
    const mockScores = [{ name: 'Player1', score: 100 }, { name: 'Player2', score: 200 }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockScores),
      })
    );

    // Act
    const scores = await fetchScores();

    // Assert
    expect(scores).toEqual(mockScores);
    expect(global.fetch).toHaveBeenCalledWith('/api/scores');
  });
});