class KeyFrameAnimation extends Animation {
    constructor(keyFrames) {
        var ks = keyFrames;
        super();

        this.keyFrames = keyFrames;
        
        this.sumT = 0;
        this.ma = [];
    }

    get update() {
        this.sumT += time;


    }

    get apply() {
        scene.multMatrix(this.ma);
    }

}