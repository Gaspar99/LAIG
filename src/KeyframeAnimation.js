class KeyFrameAnimation extends Animation {
    constructor() {
        super(keyFrames);

        this.sumT = 0;
        this.ma = [];
    }

    get update(time) {
        this.sumT += time;

        
    }

    get apply(scene) {
        scene.multMatrix(this.ma);
    }

}