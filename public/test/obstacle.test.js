import Obstacle from './../obstacle/obstacle';

describe('Obstacle', () => {
  let ctx;
  let canvas;
  let obstacle;
  const width = 50;
  const height = 100;
  const scalingRatio = 1;
  const x = 300;
  const y = 400;
  const numObstacles = 3;

  beforeEach(() => {
    canvas = { width: 800, height: 600 };
    ctx = {
      canvas,
      drawImage: jest.fn(),
    };
    obstacle = new Obstacle(ctx, width, height, scalingRatio, x, y, numObstacles);
  });

  test('constructor initializes properties correctly', () => {
    expect(obstacle.ctx).toBe(ctx);
    expect(obstacle.canvas).toBe(canvas);
    expect(obstacle.height).toBe(height * scalingRatio);
    expect(obstacle.width).toBe(width * scalingRatio);
    expect(obstacle.scalingRatio).toBe(scalingRatio);
    expect(obstacle.numObstacles).toBe(numObstacles);
    expect(obstacle.images.length).toBe(numObstacles);
    expect(obstacle.image_no).toBe(0);
    expect(obstacle.x).toBe(-canvas.width);
    expect(obstacle.y).toBe(canvas.height - obstacle.height);
  });

  test('draw method calls drawImage with correct parameters', () => {
    obstacle.draw();
    expect(ctx.drawImage).toHaveBeenCalledWith(
      obstacle.images[obstacle.image_no],
      obstacle.x,
      obstacle.y,
      obstacle.width,
      obstacle.height
    );
  });

  test('collideWith returns true when obstacle collides with sprite', () => {
    const sprite = {
      x: obstacle.x,
      y: obstacle.y,
      width: obstacle.width,
      height: obstacle.height,
    };

    const collision = obstacle.collideWith(sprite);
    expect(collision).toBe(true);
  });

  test('collideWith returns false when obstacle does not collide with sprite', () => {
    const sprite = {
      x: obstacle.x + obstacle.width * 2,
      y: obstacle.y,
      width: obstacle.width,
      height: obstacle.height,
    };

    const collision = obstacle.collideWith(sprite);
    expect(collision).toBe(false);
  });

  test('collideWith returns true when sprite partially overlaps obstacle', () => {
    const sprite = {
      x: obstacle.x + obstacle.width / 2,
      y: obstacle.y + obstacle.height / 2,
      width: obstacle.width,
      height: obstacle.height,
    };

    const collision = obstacle.collideWith(sprite);
    expect(collision).toBe(false);
  });
});
