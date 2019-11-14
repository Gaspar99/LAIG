class MyCylinder2 extends CGFobject {
    constructor(scene, base, top, height, slices, stacks){
        super(scene);
        this.base = base;
        this.top = top;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.makeSurfaces();
    }

    makeSurfaces(){
        var controlPoints1 = [	// U = 0
                                [ // V = 0..1;
                                    [ -this.base, 0.0, 0.0, 1 ],
                                    [ -this.top, this.height, 0.0, 1 ]
                                ],
                                // U = 1
                                [ // V = 0..1
                                    [ -this.base, 0.0, (4/3)*this.base, 1 ],
                                    [ -this.top, this.height, (4/3)*this.top, 1 ]							 
                                ],
                                // U = 2
                                [ // V = 0..1							 
                                    [ this.base, 0.0, (4/3)*this.base, 1 ],
                                    [ this.top, this.height, (4/3)*this.top, 1 ]
                                ],
                                // U = 3
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
                                    [ this.base, 0.0, -(4/3)*this.base, 1 ],
                                    [ this.top, this.height, -(4/3)*this.top, 1 ]							 
                                ],
                                // U = 2
                                [ // V = 0..1							 
                                    [ -this.base, 0.0, -(4/3)*this.base, 1 ],
                                    [ -this.top, this.height, -(4/3)*this.top, 1 ]
                                ],
                                // U = 3
                                [ // V = 0..1							 
                                    [ -this.base, 0.0, 0.0, 1 ],
                                    [ -this.top, this.height, 0.0, 1 ]
                                ]
                            ];

      
                            
        
        this.halfCylinder1 = new MyPatch(this.scene, 4, 2, Math.round(this.slices/2), this.stacks, controlPoints1);
        this.halfCylinder2 = new MyPatch(this.scene, 4, 2, Math.round(this.slices/2), this.stacks, controlPoints2);
    }

    display() {
        this.halfCylinder1.display();
        this.halfCylinder2.display();
    }

    updateTexCoords(length_s, length_t) {
    }
}