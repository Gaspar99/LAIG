/**
 * Creates a patch using NURBS surfaces
 */
class MyPatch extends CGFobject {
    /**
     * Creates patch object
     * @argument scene XML scene
     * @argument nPointsU Number of points of each horizontal line
     * @argument nPointsV Number of points of each vertical line
     * @argument npartsU Number of parts in the horizontal axis
     * @argument npartsV Number of parts in the vertical axis
     * @argument controlPoints Control points of the surface
     */
    constructor(scene, nPointsU, nPointsV, npartsU, npartsV, controlPoints){
        super(scene);
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.makeSurface();
    }

    /**
     * Creates NURB surface
     */
    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.nPointsU - 1, this.nPointsV - 1, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface);

        this.obj.initBuffers();
    }

    /**
     * Displays surfaces
     */
    display() {
        this.obj.display();
    }

    /**
    * Updates texture coords, with given length_s and length_t
    */
    updateTexCoords(length_s, length_t) {
    }
}