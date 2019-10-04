class MyCylinder extends CGFobject {
    constructor(scene, id, base, top, height, slices, stacks){
        super(scene);
        this.slices=slices;
        this.base=base;
        this.top=top;
        this.height = height;
        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [];
        this.indices=[];
        this.normals=[];
        this.texCoords = [];

        var angDiff= 2*Math.PI/this.slices;
        var ang=0;
        
        for(var i=0; i<this.slices; i++){
            this.vertices.push(Math.cos(ang)*this.base, -Math.sin(ang)*this.base, 0);
            this.vertices.push(Math.cos(ang)*this.top, -Math.sin(ang)*this.top, this.height);

            this.indices.push(2*i,(2*i+2) % (this.slices*2),2*i+1);
            this.indices.push(2*i+1,(2*i+2)%(this.slices*2),(2*i+3)%(this.slices*2));
            
            this.normals.push(Math.cos(ang), -Math.sin(ang), 0);
            this.normals.push(Math.cos(ang), -Math.sin(ang), 0);

            this.texCoords.push((Math.cos(ang) + 1)/2, (Math.sin(ang) + 1)/2);
            this.texCoords.push((Math.cos(ang) + 1)/2, (Math.sin(ang) + 1)/2);
            
            ang+=angDiff;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}