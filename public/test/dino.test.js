import Dino from '../dino/dino.js';

jest.mock('../dino/move', () => ({
  run: jest.fn(),
  jump: jest.fn(),
})); 

import { run, jump } from '../dino/move';

describe('Dino', () => {
  let ctx;
  let dino;
  const width = 50;
  const height = 50;
  const scaleRatio = 1;

  beforeEach(() => {
    ctx = {
      canvas: {
        height: 600,
      },
      drawImage: jest.fn(),
    };
    dino = new Dino(ctx, width, height, scaleRatio);
  });

  test('constructor initializes properties correctly', () => {
    expect(dino.ctx).toBe(ctx);
    expect(dino.canvas).toBe(ctx.canvas);
    expect(dino.width).toBe(width * scaleRatio);
    expect(dino.height).toBe(height * scaleRatio);
    expect(dino.x).toBe(20 * scaleRatio);
    expect(dino.y).toBe(ctx.canvas.height - height * scaleRatio + 10 * scaleRatio);
    expect(dino.standingy).toBe(dino.y);
    expect(dino.scaleRatio).toBe(scaleRatio);
    expect(dino.image_no).toBe(1);
    expect(dino.forward).toBe(true);
    expect(dino.TIMER).toBe(75);
    expect(dino.walkTimer).toBe(dino.TIMER);
    expect(dino.runImages.length).toBe(3); 
    expect(dino.jumping).toBe(false);
    expect(dino.jumpPressed).toBe(false);
    expect(dino.sinceJump).toBe(0);
    expect(dino.initialVelocity).toBe(17);
    expect(dino.gravity).toBe(1);
  });

  test('keydown sets jumpPressed to true when Space is pressed', () => {
    const event = new KeyboardEvent('keydown', { code: 'Space' });
    dino.keydown(event);
    expect(dino.jumpPressed).toBe(true);
  });

  test('update calls run and jump functions and resets jumpPressed', () => {
    const frameTimeDelta = 16;
    dino.jumpPressed = true;
    dino.update(frameTimeDelta);
    expect(run).toHaveBeenCalledWith(dino, frameTimeDelta);
    expect(jump).toHaveBeenCalledWith(dino, frameTimeDelta);
    expect(dino.jumpPressed).toBe(false);
  });

  test('draw calls ctx.drawImage with correct arguments', () => {
    dino.image_no = 1;
    dino.draw();
    expect(ctx.drawImage).toHaveBeenCalledWith(dino.runImages[dino.image_no], dino.x, dino.y, dino.width, dino.height);
  });
});