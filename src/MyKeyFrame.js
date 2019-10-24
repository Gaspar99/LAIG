class MyKeyFrame {
    constructor(instant, transCoords, rotateCoords, scaleCoords) {

        // Instant
        this.instant = instant;

        // Translate info
        this.transX = transCoords[0];
        this.transY = transCoords[1];
        this.transZ = transCoords[2];

        // Rotate info
        this.angleX = rotateCoords[0];
        this.angleY = rotateCoords[1];
        this.angleZ = rotateCoords[2];

        // Scale info
        this.scaleX = scaleCoords[0];
        this.scaleY = scaleCoords[1];
        this.scaleZ = scaleCoords[2];
    }
}
