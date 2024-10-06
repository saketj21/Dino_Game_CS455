import ObstacleController from './../obstacle/controller.js';

describe('ObstacleController', () => {
  let ctx;
  let canvas;
  let obstacleController;
  let obstacle;
  const scaleRatio = 1;
  const speed = 5;
  const gameSpeed = 2;
  const frameTimeDelta = 0.016;

  beforeEach(() => {
    canvas = { width: 800, height: 600 };
    ctx = { canvas };
    obstacleController = new ObstacleController(ctx, scaleRatio, speed);

    obstacle = {
      x: canvas.width,
      width: 50,
      image_no: 0,
      numObstacles: 3
    };
  });

  test('constructor initializes properties correctly', () => {
    expect(obstacleController.ctx).toBe(ctx);
    expect(obstacleController.canvas).toBe(canvas);
    expect(obstacleController.scaleRatio).toBe(scaleRatio);
    expect(obstacleController.speed).toBe(speed);
    expect(obstacleController.obstacleTimer).toBeGreaterThanOrEqual(1000);
    expect(obstacleController.obstacleTimer).toBeLessThanOrEqual(2000);
  });

  test('update moves obstacle based on speed, gameSpeed, and frameTimeDelta', () => {
    const initialX = obstacle.x;
    
    obstacleController.update(obstacle, gameSpeed, frameTimeDelta);

    const expectedX = initialX - speed * gameSpeed * frameTimeDelta * scaleRatio;
    expect(obstacle.x).toBeCloseTo(expectedX);
  });

  test('update resets obstacle position and timer when obstacle moves off screen', () => {
    obstacle.x = -obstacle.width;
    obstacleController.obstacleTimer = 0;
    obstacleController.update(obstacle, gameSpeed, frameTimeDelta);
    expect(obstacle.x).toBeCloseTo(canvas.width * 2,0);
    expect(obstacleController.obstacleTimer).toBeGreaterThanOrEqual(1000);
    expect(obstacleController.obstacleTimer).toBeLessThanOrEqual(2000);
    expect(obstacle.image_no).toBeGreaterThanOrEqual(0);
    expect(obstacle.image_no).toBeLessThan(obstacle.numObstacles);
});


  test('obstacleTimer decreases correctly with frameTimeDelta', () => {
    const initialTimer = obstacleController.obstacleTimer;

    obstacleController.update(obstacle, gameSpeed, frameTimeDelta);

    expect(obstacleController.obstacleTimer).toBeCloseTo(initialTimer - frameTimeDelta);
  });

  test('does not reset obstacle if timer has not reached 0 and obstacle is on screen', () => {
    obstacle.x = canvas.width / 2;
    const initialX = obstacle.x;
    const initialTimer = obstacleController.obstacleTimer;

    obstacleController.update(obstacle, gameSpeed, frameTimeDelta);

    expect(obstacle.x).toBeLessThan(initialX);
    expect(obstacleController.obstacleTimer).toBeCloseTo(initialTimer - frameTimeDelta);
    expect(obstacle.image_no).toBe(0); // should not change
  });
});
