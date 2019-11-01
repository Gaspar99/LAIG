class MyCylinder2 extends CGFobject {
    constructor(scene, base, top, height, slices, stacks){
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers(){
        var controlPoints1 = [	// U = 0
                                [ // V = 0..1;
                                    [ -this.base, 0.0, 0.0, 1 ],
                                    [ -this.top, this.height, 0.0, 1 ]
                
                                ],
                                // U = 1
                                [ // V = 0..1
                                    [ 0.0, 0.0, 3, 1 ],
                                    [ 0.0, this.height, 3, 1 ]							 
                                ],
                                // U = 2
                                [ // V = 0..1							 
                                    [ this.base, 0.0, 0.0, 1 ],
                                    [ this.top, this.height, 0.0, 1 ]
                                ]
                            ];

        var controlPoints2 = [	// U = 0
                                [ // V = 0..1;
                                    [ this.base, 0.0, 0.0, 1 ],
                                    [ this.top, this.height, 0.0, 1 ]
                                ],
                                // U = 1
                                [ // V = 0..1
                                    [ 0.0, 0.0, -3, 1 ],
                                    [ 0.0, this.height, -3, 1 ]							 
                                ],
                                // U = 2
                                [ // V = 0..1							 
                                    [ -this.base, 0.0, 0.0, 1 ],
                                    [ -this.top, this.height, 0.0, 1 ]
                                ]
                            ];
        
        var nurbsSurface1 = new CGFnurbsSurface(2, 1, controlPoints1);
        this.halfCylinder1 = new CGFnurbsObject(this.scene, this.slices/2, this.stacks, nurbsSurface1);

        var nurbsSurface2 = new CGFnurbsSurface(2, 1, controlPoints2);
        this.halfCylinder2 = new CGFnurbsObject(this.scene, this.slices/2, this.stacks, nurbsSurface2);
    }

    display() {
        this.halfCylinder1.display();
        this.halfCylinder2.display();
    }

    updateTexCoords(length_s, length_t) {
    }
}