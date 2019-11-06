class MyPatch extends CGFobject {
    constructor(scene, nPointsU, nPointsV, npartsU, npartsV, controlPoints){
        super(scene);
        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }

    initBuffers(){
        var nurbsSurface = new CGFnurbsSurface(this.nPointsU, this.nPointsV, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface );
    }

    display() {
        this.obj.display();
    }

    updateTexCoords(length_s, length_t) {
    }
}