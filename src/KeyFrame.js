class KeyFrame {
    constructor(instant, transfCoords, angleCoords, scaleCoords) {

        // Instant
        this.instant = instant;

        // Translate info
        this.transfX = transfCoords[0];
        this.transfY = transfCoords[1];
        this.transfZ = transfCoords[2];

        // Rotate info
        this.angleX = angleCoords[0];
        this.angleY = angleCoords[1];
        this.angleZ = angleCoords[2];

        // Scale info
        this.scaleX = scaleCoords[0];
        this.scaleY = scaleCoords[1];
        this.scaleZ = scaleCoords[2];
    }
}