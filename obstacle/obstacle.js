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
}