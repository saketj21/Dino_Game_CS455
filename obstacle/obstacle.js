export default class Obstacle{
    constructor(ctx, width, height, scalingRatio, x, y){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.height = height * scalingRatio;
        this.width = width * scalingRatio;
        this.scalingRatio = scalingRatio
        this.image = new Image();
        this.image.src = "../obstacle/obstacle.png";
        this.x = -this.canvas.width;
        this.y = this.canvas.height - this.height;
    }

    draw(){
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collideWith(sprite) {
        const adjustByX = 1.95, adjustByY = 1.2;
        if (
          sprite.x < this.x + this.width / adjustByX &&
          sprite.x + sprite.width / adjustByX > this.x &&
          sprite.y < this.y + this.height / adjustByY &&
          sprite.height + sprite.y / adjustByY > this.y
        ) {
          return true;
        } else {
          return false;
        }
      }
}