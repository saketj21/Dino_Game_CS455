import { run } from '../src/dino/move';

describe('run function', () => {
  let dino;

  beforeEach(() => {
    dino = {
      walkTimer: 100,
      image_no: 0,
      forward: true,
      TIMER: 100,
    };
  });

  test('should decrement walkTimer by frameTimeDelta', () => {
    run(dino, 50);
    expect(dino.walkTimer).toBe(50);
  });

  test('should reset walkTimer and increment image_no when walkTimer <= 0', () => {
    dino.walkTimer = 0;
    run(dino, 50);
    expect(dino.walkTimer).toBe(dino.TIMER);
    expect(dino.image_no).toBe(1);
  });

  test('should set forward to false when image_no >= 2', () => {
    dino.image_no = 2;
    dino.walkTimer = 0;
    run(dino, 50);
    expect(dino.forward).toBe(false);
  });

  test('should set forward to true when image_no <= 0', () => {
    dino.image_no = 0;
    dino.forward = false;
    dino.walkTimer = 0;
    run(dino, 50);
    expect(dino.forward).toBe(true);
  });

  test('should increment image_no when forward is true', () => {
    dino.forward = true;
    dino.walkTimer = 0;
    run(dino, 50);
    expect(dino.image_no).toBe(1);
  });

  test('should decrement image_no when forward is false', () => {
    dino.forward = false;
    dino.image_no = 1;
    dino.walkTimer = 0;
    run(dino, 50);
    expect(dino.image_no).toBe(0);
  });
});