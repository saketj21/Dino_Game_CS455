function run(dino, frameTimeDelta){
    dino.walkTimer -= frameTimeDelta;
    // console.log(dino.walkTimer);
    if(dino.walkTimer <= 0){
        if(dino.image_no >= 2){
            dino.forward = false;
        }
        if(dino.image_no <= 0){
            dino.forward = true;
        }
        if(dino.forward){
            dino.image_no++;
        }else{
            dino.image_no--;
        }
        dino.walkTimer = dino.TIMER;
    }
}

function jump(dino, frameTimeDelta){
    if(dino.jumping){
        dino.image_no = 1;
    }

    if(dino.y >= dino.standingy){
        dino.jumping = false;
        dino.y = dino.standingy;
    }

    if(dino.jumpPressed && !dino.jumping){
        dino.sinceJump = 0;
        dino.jumping = true;
    }

    dino.sinceJump += frameTimeDelta/15;

    if(dino.jumping){
        dino.y = dino.standingy - dino.scaleRatio * (dino.initialVelocity * dino.sinceJump - dino.gravity * (dino.sinceJump ** 2) / 2);
    }

}

export { run, jump };