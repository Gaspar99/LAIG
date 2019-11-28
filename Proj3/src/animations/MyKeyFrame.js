/**
 * Responsible for storing key frame data
 */
class MyKeyFrame {
    /**
     * Creates Key Frame object
     * @argument instant Instant in which the animated object must have suffered a total transformation equal to the key frame values
     * @argument transCoords Translate coordinates for the key frame
     * @argument rotateCoords Rotation coordinates for the key frame
     * @argument scaleCoords Scale coordinates for the key frame
     */
    constructor(instant, transCoords, rotateCoords, scaleCoords) {

        // Instant - stored in milliseconds
        this.instant = instant * 1000;

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
