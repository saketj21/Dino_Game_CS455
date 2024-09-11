import Score from '../src/score/Score';

describe('Score', () => {
  let ctx;
  let score;

  beforeEach(() => {
    ctx = {
      canvas: document.createElement('canvas'),
      fillText: jest.fn(),
      font: '',
      fillStyle: '',
    };
    score = new Score(ctx, 1);
    localStorage.clear(); 
  });

  test('constructor initializes properties correctly', () => {
    expect(score.ctx).toBe(ctx);
    expect(score.canvas).toBe(ctx.canvas);
    expect(score.scaleRatio).toBe(1);
    expect(score.score).toBe(0);
    expect(score.HIGH_SCORE_KEY).toBe('highScore');
  });

  test('update method should correctly update the score', () => {
    score.update(100);
    expect(score.score).toBe(1); // 100 * 0.01 = 1
  });

  test('reset method should set the score to 0', () => {
    score.update(100);
    score.reset();
    expect(score.score).toBe(0);
  });

  test('setHighScore method should update high score in localStorage', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '50');
    score.score = 100;
    score.setHighScore();
    expect(localStorage.getItem(score.HIGH_SCORE_KEY)).toBe('100');
  });

  test('setHighScore should not update high score if current score is lower', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '100');
    score.score = 50;
    score.setHighScore();
    expect(localStorage.getItem(score.HIGH_SCORE_KEY)).toBe('100');
  });

  test('draw method should call ctx.fillText with correct arguments', () => {
    score.update(100);
    score.draw();
    const scorePadded = '000001';
    const highScorePadded = '000000';
    const scoreX = ctx.canvas.width - 75 * score.scaleRatio;
    const highScoreX = scoreX - 125 * score.scaleRatio;
    expect(ctx.fillText).toHaveBeenCalledWith(scorePadded, scoreX, 20);
    expect(ctx.fillText).toHaveBeenCalledWith(`HI ${highScorePadded}`, highScoreX, 20);
  });

  test('draw method should display high score from localStorage', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '50');
    score.update(100);
    score.draw();
    const scorePadded = '000001';
    const highScorePadded = '000050';
    const scoreX = ctx.canvas.width - 75 * score.scaleRatio;
    const highScoreX = scoreX - 125 * score.scaleRatio;
    expect(ctx.fillText).toHaveBeenCalledWith(scorePadded, scoreX, 20);
    expect(ctx.fillText).toHaveBeenCalledWith(`HI ${highScorePadded}`, highScoreX, 20);
  });

  test('draw method should correctly scale text based on scaleRatio', () => {
    score = new Score(ctx, 2); 
    score.update(100);
    score.draw();
    const fontSize = 20 * 2; 
    expect(ctx.font).toBe(`${fontSize}px serif`);
  });

  test('draw method should set fillStyle to black', () => {
    score.draw();
    expect(ctx.fillStyle).toBe('black');
  });

  test('draw method should pad the score and high score correctly', () => {
    localStorage.setItem(score.HIGH_SCORE_KEY, '5');
    score.score = 3;
    score.draw();
    const scorePadded = '000003';
    const highScorePadded = '000005';
    const scoreX = ctx.canvas.width - 75 * score.scaleRatio;
    const highScoreX = scoreX - 125 * score.scaleRatio;
    expect(ctx.fillText).toHaveBeenCalledWith(scorePadded, scoreX, 20);
    expect(ctx.fillText).toHaveBeenCalledWith(`HI ${highScorePadded}`, highScoreX, 20);
  });
});