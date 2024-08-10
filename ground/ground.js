export default class Ground {
    constructor(ctx, width, height, scaleRatio) {
      this.ctx = ctx;
      this.canvas = ctx.canvas;
      this.width = width;
      this.height = height;
      this.scaleRatio = scaleRatio;
  
      this.x = 0;
      this.y = this.canvas.height - this.height;
  
      this.groundImage = new Image();
      this.groundImage.src = "../ground/ground.png";
    }
  
    draw() {
      this.ctx.drawImage(
        this.groundImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
  
      this.ctx.drawImage(
        this.groundImage,
        this.x + this.width,
        this.y,
        this.width,
        this.height
      );
  
      if (this.x < -this.width) {
        this.x = 0;
      }
    }

  }