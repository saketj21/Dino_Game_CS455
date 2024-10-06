import { run, jump } from '../dino/move';

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

describe('jump function', () => {
  let dino;

  beforeEach(() => {
    dino = {
      jumping: false,
      jumpPressed: false,
      y: 100,
      standingy: 100,
      scaleRatio: 1,
      initialVelocity: 10,
      gravity: 9.8,
      sinceJump: 0,
      image_no: 0,
    };
  });

  test('should set image_no to 1 when dino is jumping', () => {
    dino.jumping = true;
    jump(dino, 10);
    expect(dino.image_no).toBe(1);
  });

  test('should set jumping to false and y to standingy when y >= standingy', () => {
    dino.y = 101;
    jump(dino, 10);
    expect(dino.jumping).toBe(false);
    expect(dino.y).toBe(dino.standingy);
  });

  test('should set jumping to true when jumpPressed and not already jumping', () => {
    dino.jumpPressed = true;
    jump(dino, 10);
    expect(dino.jumping).toBe(true);
    expect(dino.sinceJump).toBeCloseTo(10 / 15);
  });

  test('should update y position when dino is jumping', () => {
    dino.jumping = true;
    dino.y = dino.standingy;
    jump(dino, 15);
    expect(dino.y).toBeLessThanOrEqual(dino.standingy);
  });

  test('should reset y to standingy after jump ends', () => {
  dino.jumping = true;
  dino.y = 100;
  dino.standingy = 100;
  jump(dino, 100);
  expect(dino.y).toBe(100);
});
});
