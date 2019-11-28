/**
 * Creates a Plane using NURBS surfaces
 */
class MyPlane extends CGFobject {
    /**
     * Creates plane object
     * @argument scene XML scene
     * @argument npartsU Number of parts in the horizontal axis
     * @argument npartsV Number of parts in the vertical axis
     */
    constructor(scene, npartsU, npartsV){
        super(scene);
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.makeSurface();
    }

    /**
     * Creates NURB surface
     */
    makeSurface() {
        var controlPoints = [	// U = 0
                                [ // V = 0..1;
                                    [ -0.5, 0.0, -0.5, 1 ],
                                    [ 0.5, 0.0, -0.5, 1 ]
                
                                ],
                                // U = 1
                                [ // V = 0..1
                                    [ -0.5, 0.0, 0.5, 1 ],
                                    [ 0.5, 0.0, 0.5, 1 ]							 
                                ]
                            ];
        
        var nurbsSurface = new CGFnurbsSurface(1, 1, controlPoints);

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