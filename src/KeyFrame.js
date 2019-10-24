class KeyFrame {
    constructor(instant, transfX, transfY, transfZ, angleX, angleY, angleZ, scaleX, scaleY, scaleZ) {

        // Instant
        this.instant = instant;

        // Translate info
        this.transfX = transfX;
        this.transfY = transfY;
        this.transfZ = transfZ;

        // Rotate info
        this.angleX = angleX;
        this.angleY = angleY;
        this.angleZ = angleZ;

        // Scale info
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.scaleZ = scaleZ;
    }
}