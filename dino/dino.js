export default class Dino{
    constructor(ctx, width, height, scaleRatio){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width / scaleRatio;
        this.height = height / scaleRatio;
        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - height + 75 * scaleRatio;
        this.image = new Image();
        this.image.src = "../dino/dino_run_2.png";
    }

    draw(){
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}