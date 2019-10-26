var DEGREE_TO_RAD = Math.PI / 180;

class MyKeyFrameAnimation {
    constructor(keyFrames) {
        this.keyFrames = keyFrames;

        this.addInitialKeyFrame();

        this.currentTimeInterval = 0;
        this.timeIntervals = [];
        this.constructTimeIntervals();

        this.sumT = 0;

        this.identityMatrix = mat4.create();
        this.translateMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        this.scaleMatrix = mat4.create();
    }

    update(time) {
        this.sumT += time;

        if (!this.checkTimeInterval())
            return;

        var timeIntervalPercentage = this.sumT / this.timeIntervals[this.currentTimeInterval];

        // Interpolation of transformations
        this.calculateTranslateMatrix(timeIntervalPercentage);
        this.calculateRotationMatrix(timeIntervalPercentage);
        this.calculateScaleMatrix(timeIntervalPercentage);
    }

    apply(scene) {
        var ma = mat4.create();

        var ma = mat4.multiply(ma, ma, this.translateMatrix);
        var ma = mat4.multiply(ma, ma, this.rotationMatrix); 
        var ma = mat4.multiply(ma, ma, this.scaleMatrix);  

        scene.multMatrix(ma);
    }

    addInitialKeyFrame() {

        var transCoords = [0.0, 0.0, 0.0];
        var rotateCoords = [0.0, 0.0, 0.0];
        var scaleCoords = [1.0, 1.0, 1.0];

        var initialKeyFrame = new MyKeyFrame(0.0, transCoords, rotateCoords, scaleCoords);

        this.keyFrames.unshift(initialKeyFrame);
    }

    constructTimeIntervals() {
        for (var i = 0; i < this.keyFrames.length - 1; i++) {
            this.timeIntervals[i] = this.keyFrames[i + 1].instant - this.keyFrames[i].instant;
        }
    }

    checkTimeInterval() {

        if (this.sumT > this.timeIntervals[this.currentTimeInterval]) {
            this.sumT -= this.timeIntervals[this.currentTimeInterval];
            this.currentTimeInterval++;
        }

        if (this.currentTimeInterval >= this.keyFrames.length - 1)
            return false;

        return true;
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

        this.translateMatrix = mat4.translate(this.translateMatrix, this.identityMatrix, coords);
    }

    calculateRotationMatrix(timeIntervalPercentage) {

        var keyFrame1 = this.keyFrames[this.currentTimeInterval];
        var keyFrame2 = this.keyFrames[this.currentTimeInterval + 1];

        // X Coord
        var dx = keyFrame1.angleX + (keyFrame2.angleX - keyFrame1.angleX) * timeIntervalPercentage;
        this.rotationMatrix = mat4.rotateX(this.rotationMatrix, this.identityMatrix, dx * DEGREE_TO_RAD);

        // Y Coord
        var dy = keyFrame1.angleY + (keyFrame2.angleY - keyFrame1.angleY) * timeIntervalPercentage;
        this.rotationMatrix = mat4.rotateY(this.rotationMatrix, this.rotationMatrix, dy * DEGREE_TO_RAD);

        // Z Coord
        var dz = keyFrame1.angleZ + (keyFrame2.angleZ - keyFrame1.angleZ) * timeIntervalPercentage;
        this.rotationMatrix = mat4.rotateZ(this.rotationMatrix, this.rotationMatrix, dz * DEGREE_TO_RAD);
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

        this.scaleMatrix = mat4.scale(this.scaleMatrix, this.identityMatrix, coords);
    }

}

