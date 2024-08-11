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

export { run };