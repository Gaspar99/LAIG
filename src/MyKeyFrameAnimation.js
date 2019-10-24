class MyKeyFrameAnimation {
    constructor(keyFrames) {
        this.keyFrames = keyFrames;

        this.addInitialKeyFrame();

        this.currentTimeInterval = 0;
        this.timeIntervals = [];
        this.constructTimeIntervals();

        this.ma = mat4.create();
        this.sumT = 0;
    }

    update(time) {
        this.sumT += time;

        this.checkTimeInterval();

        var timeIntervalPercentage = this.sumT / this.timeIntervals[this.currentTimeInterval];

        // Interpolation of transformations
        this.calculateTranslateMatrix(timeIntervalPercentage);
        this.calculateRotationMatrix(timeIntervalPercentage);
        this.calculateScaleMatrix(timeIntervalPercentage);
    }

    apply(scene) {
        scene.multMatrix(this.ma);
    }

    addInitialKeyFrame() {

        var transCoords = [0, 0, 0];
        var rotateCoords = [0, 0, 0];
        var scaleCoords = [1, 1, 1];

        var initialKeyFrame = new MyKeyFrame(0.0, transCoords, rotateCoords, scaleCoords);

        this.keyFrames.unshift(initialKeyFrame);
    }

    constructTimeIntervals() {
        for (var i = 0; i < this.keyFrames.length - 1; i++) {
            this.timeIntervals[i] = this.keyFrames[i].instance - this.keyFrames[i + 1].instance;
        }
    }

    checkTimeInterval() {
        if (this.sumT > this.timeIntervals[this.currentTimeInterval]) {
            this.sumT -= this.timeIntervals[this.currentTimeInterval];
            this.currentTimeInterval++;
        }
    }

    calculateTranslateMatrix(timeIntervalPercentage) {
        
        var keyFrame1 = this.keyFrames[this.currentTimeInterval];
        var keyFrame2 = this.keyFrames[this.currentTimeInterval + 1];

        // X Coord
        var dx = keyFrame1.transX + (keyFrame2.transX - keyFrame1.transX) * timeIntervalPercentage;

        // Y Coord
        var dy = keyFrame1.transY + (keyFrame2.transY - keyFrame1.transY) * timeIntervalPercentage;

        // Z Coord
        var dz = keyFrame1.transZ + (keyFrame2.transZ - keyFrame1.transZ) * timeIntervalPercentage;

        var coords = [dx, dy, dz];

        this.ma = mat4.translate(this.ma, this.ma, coords);
    }

    calculateRotationMatrix(timeIntervalPercentage) {

        var keyFrame1 = this.keyFrames[this.currentTimeInterval];
        var keyFrame2 = this.keyFrames[this.currentTimeInterval + 1];

        // X Coord
        var dx = keyFrame1.angleX + (keyFrame2.angleX - keyFrame1.angleX) * timeIntervalPercentage;
        this.ma = mat4.rotateX(this.ma, this.ma, dx);

        // Y Coord
        var dy = keyFrame1.angleY + (keyFrame2.angleY - keyFrame1.angleY) * timeIntervalPercentage;
        this.ma = mat4.rotateY(this.ma, this.ma, dy);

        // Z Coord
        var dz = keyFrame1.angleZ + (keyFrame2.angleZ - keyFrame1.angleZ) * timeIntervalPercentage;
        this.ma = mat4.rotateZ(this.ma, this.ma, dz);
    }

    calculateScaleMatrix(timeIntervalPercentage) {

        var keyFrame1 = this.keyFrames[this.currentTimeInterval];
        var keyFrame2 = this.keyFrames[this.currentTimeInterval + 1];

        // X Coord
        var dx = keyFrame1.scaleX + (keyFrame2.scaleX - keyFrame1.scaleX) * timeIntervalPercentage;

        // Y Coord
        var dy = keyFrame1.scaleY + (keyFrame2.scaleY - keyFrame1.scaleY) * timeIntervalPercentage;

        // Z Coord
        var dz = keyFrame1.scaleZ + (keyFrame2.scaleZ - keyFrame1.scaleZ) * timeIntervalPercentage;

        var coords = [dx, dy, dz];

        this.ma = mat4.scale(this.ma, this.ma, coords);
    }

}

