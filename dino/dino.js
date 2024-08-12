import { run, jump } from "./dino/move.js"

export default class Dino{

    TIMER = 75;
    walkTimer = this.TIMER;
    runImages = [];
    jumping = false;
    jumpPressed = false;
    sinceJump = 0;
    initialVelocity = 17;
    gravity = 1;

    constructor(ctx, width, height, scaleRatio){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width * scaleRatio;
        this.height = height * scaleRatio;
        this.x = 20 * scaleRatio;
        this.y = this.canvas.height - height * scaleRatio + 10 * scaleRatio;
        this.standingy = this.y;
        this.scaleRatio = scaleRatio;
        this.image_no = 1;
        this.forward = true;

        let run1Img = new Image();
        run1Img.src = "./dino/dino_run_1.png";

        let run2Img = new Image();
        run2Img.src = "./dino/dino_run_2.png";
        console.log(run2Img.src);

        let run3Img = new Image();
        run3Img.src = "./dino/dino_run_3.png";

        this.runImages.push(run1Img);
        this.runImages.push(run2Img);
        this.runImages.push(run3Img);

        window.removeEventListener("keydown", this.keydown);

        window.addEventListener("keydown", this.keydown);
    }

    keydown = (event) => {
        if(event.code === "Space"){
            console.log("not pressed now");
            this.jumpPressed = true;
        }
    };

    update(frameTimeDelta){
        run(this, frameTimeDelta);
        jump(this, frameTimeDelta);
        this.jumpPressed = false;
    }

    draw(){
        this.ctx.drawImage(this.runImages[this.image_no], this.x, this.y, this.width, this.height);
    }
}
