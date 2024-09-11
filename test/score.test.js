import Score from '../src/score/Score';

describe('Score', () => {
  let ctx;
  let score;

  beforeEach(() => {
    // Mock the canvas context
    ctx = {
      canvas: document.createElement('canvas'),
      fillText: jest.fn(), // Mock the fillText method
    };
    score = new Score(ctx, 1);
  });

  test('constructor initializes properties correctly', () => {
    expect(score.ctx).toBe(ctx);
    expect(score.scaleRatio).toBe(1);
    expect(score.score).toBe(0);
    expect(score.highScore).toBe(0);
    expect(score.HIGH_SCORE_KEY).toBe('highScore');
  });

  test('initial score should be 0', () => {
    expect(score.score).toBe(0);
  });

  test('update method should increase the score', () => {
    score.update(100);
    expect(score.score).toBe(1);
  });

  test('reset method should set the score to 0', () => {
    score.update(100);
    score.reset();
    expect(score.score).toBe(0);
  });

  test('setHighScore should update high score in localStorage', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '50');
    score.update(6000); // This should set score to 60
    score.setHighScore();
    expect(Number(localStorage.getItem(score.HIGH_SCORE_KEY))).toBe(60);
  });

  test('setHighScore should not update high score if current score is lower', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '50');
    score.update(100); // This should set score to 1
    score.setHighScore();
    expect(Number(localStorage.getItem(score.HIGH_SCORE_KEY))).toBe(50);
  });

  test('draw method should call ctx.fillText with correct arguments', () => {
    score.update(100);
    score.draw();
    expect(ctx.fillText).toHaveBeenCalledWith('Score: 1', 10, 50);
  });

  test('getHighScore should retrieve high score from localStorage', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '50');
    expect(score.getHighScore()).toBe(50);
  });
});