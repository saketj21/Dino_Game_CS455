export default class ObstacleController {
    obstacleTimer = null;

    constructor(ctx, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.obstacleTimer = Math.floor(Math.random() * 1000 + 1000);
    }

    update(obstacle, gameSpeed, frameTimeDelta){
        if(this.obstacleTimer <= 0 && obstacle.x <= -obstacle.width){
            obstacle.x = this.canvas.width * 2;
            this.obstacleTimer = Math.floor(Math.random() * 1000 + 1000);
            obstacle.image_no = Math.floor(Math.random() * obstacle.numObstacles);
        }

        this.obstacleTimer -= frameTimeDelta;

        obstacle.x -= this.speed * gameSpeed * frameTimeDelta * this.scaleRatio;;
    }

}