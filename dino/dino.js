import { run } from "../dino/move.js"

export default class Dino{

    TIMER = 75;
    walkTimer = this.TIMER;
    runImages = [];

    constructor(ctx, width, height, scaleRatio){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width / scaleRatio;
        this.height = height / scaleRatio;
        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - height + 50 * scaleRatio;
        this.image_no = 1;
        this.forward = true;

        const run1Img = new Image();
        run1Img.src = "../dino/dino_run_1.png";

        const run2Img = new Image();
        run2Img.src = "../dino/dino_run_2.png";

        const run3Img = new Image();
        run3Img.src = "../dino/dino_run_3.png";

        this.runImages.push(run1Img);
        this.runImages.push(run2Img);
        this.runImages.push(run3Img);
    }

    update(frameTimeDelta){
        run(this, frameTimeDelta);
    }

    draw(){
        this.ctx.drawImage(this.runImages[this.image_no], this.x, this.y, this.width, this.height);
    }
}