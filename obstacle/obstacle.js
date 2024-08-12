export default class Obstacle{
    images = []

    constructor(ctx, width, height, scalingRatio, x, y, numObstacles){
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.height = height * scalingRatio;
        this.width = width * scalingRatio;
        this.scalingRatio = scalingRatio;
        this.numObstacles = numObstacles;
        for(let i = 1; i <= this.numObstacles; i++){
            let image = new Image();
            image.src =  "../obstacle/obstacle_" + i + ".png";
            console.log(image.src);
            this.images.push(image);
        }
        this.image_no = 0;
        this.x = -this.canvas.width;
        this.y = this.canvas.height - this.height;
    }

    draw(){
        this.ctx.drawImage(this.images[this.image_no], this.x, this.y, this.width, this.height);
    }

    collideWith(sprite) {
        const adjustByX = 2.5, adjustByY = 1.2;
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