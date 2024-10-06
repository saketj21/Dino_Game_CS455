import Ground from '../ground/ground';

describe('Ground', () => {
  let ctx;
  let ground;
  const width = 800;
  const height = 100;
  const scaleRatio = 1;
  const image = new Image();

  beforeEach(() => {
    // Mock the canvas context and its drawImage method
    ctx = {
      canvas: {
        height: 600,
      },
      drawImage: jest.fn(),  // Mock drawImage method
    };
    ground = new Ground(ctx, width, height, scaleRatio, image);
  });

  test('constructor initializes properties correctly', () => {
    expect(ground.ctx).toBe(ctx);
    expect(ground.canvas).toBe(ctx.canvas);
    expect(ground.width).toBe(width);
    expect(ground.height).toBe(height);
    expect(ground.scaleRatio).toBe(scaleRatio);
    expect(ground.x).toBe(0);
    expect(ground.y).toBe(ctx.canvas.height - height);
    expect(ground.groundImage).toBe(image);
  });

  test('update method updates x position correctly', () => {
    const initialX = ground.x;
    const gameSpeed = 5;
    const frameTimeDelta = 0.016;

    ground.update(gameSpeed, frameTimeDelta);

    expect(ground.x).toBe(initialX - gameSpeed * frameTimeDelta * scaleRatio);
  });

  test('draw method calls drawImage twice', () => {
    ground.draw();
    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
    expect(ctx.drawImage).toHaveBeenNthCalledWith(
      1,
      ground.groundImage,
      ground.x,
      ground.y,
      ground.width,
      ground.height
    );
    expect(ctx.drawImage).toHaveBeenNthCalledWith(
      2,
      ground.groundImage,
      ground.x + ground.width,
      ground.y,
      ground.width,
      ground.height
    );
  });

  test('reset method resets x position to 0', () => {
    ground.x = -100;
    ground.reset();
    expect(ground.x).toBe(0);
  });

  test('x resets to 0 when it goes below negative width', () => {
    ground.x = -ground.width - 1;
    ground.draw();
    expect(ground.x).toBe(0);
  });

  test('x does not reset when it is greater than or equal to negative width', () => {
    ground.x = -ground.width;
    ground.draw();
    expect(ground.x).toBe(-ground.width);
  });
});
