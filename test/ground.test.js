import Ground from '../src/ground/ground';

describe('Ground', () => {
  let ctx;
  let ground;
  const width = 800;
  const height = 100;
  const scaleRatio = 1;
  const image = new Image();

  beforeEach(() => {
    // Mock the canvas context
    ctx = {
      canvas: {
        height: 600,
      },
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
    const frameTimeDelta = 0.016; // Assuming 60 FPS, so 1/60 ≈ 0.016

    ground.update(gameSpeed, frameTimeDelta);

    expect(ground.x).toBe(initialX - gameSpeed * frameTimeDelta * scaleRatio);
  });
});