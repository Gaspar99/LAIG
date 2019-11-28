/**
 * MyCylinder class, creates a cylinder using vertices
 */
class MyCylinder extends CGFobject {
    /**
     * Creates cylinder object
     * @argument scene XML scene
     * @argument base Radius of the cylinder base circle 
     * @argument top Radius of the cylinder top circle
     * @argument height Height of the cylinder
     * @argument slices Number of parts in the horizontal axis
     * @argument stacks Number of parts in the vertical axis
     */
    constructor(scene, base, top, height, slices, stacks){
        super(scene);

        this.slices=slices;     //number of slices
        this.stacks=stacks;     //number of stacks
        this.base=base;         //base radius
        this.top=top;           //top radius
        this.height = height;   //cylinder height
        
        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [];
        this.indices=[];
        this.normals=[];
        this.texCoords = [];

        var angDiff = 2*Math.PI/this.slices;
        var ang = 0;
    
        var h = this.height/this.stacks;
        var hRadiusDif = (this.base-this.top)/this.stacks;
        var hRadius = this.base-hRadiusDif;

        var m = this.height / (this.base - this.top);
        var maxheight;
        if (hRadiusDif > 0)
            maxheight = this.top * m + this.height;
        else maxheight = this.base * m + this.height;

        for (var i = 0; i < this.slices; i++) {
            this.vertices.push(-Math.sin(ang)*this.base, Math.cos(ang)*this.base, 0);
            
            if (Math.abs(hRadiusDif) < 0.0001) {
                this.normals.push(
                  Math.cos(ang),
                  Math.sin(ang),
                  0);
              } else if (hRadiusDif > 0) {
                this.normals.push(
                  maxheight * Math.cos(ang) / Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2)),
                  maxheight * Math.sin(ang) / Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2)),
                  this.base / Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2))
                );
              } else {
                this.normals.push(
                  maxheight * Math.cos(ang) / Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2)),
                  maxheight * Math.sin(ang) / Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2)),
                  this.top / Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2))
                );
              }

            this.texCoords.push(i / this.slices, 0);

            ang+=angDiff;
        }

        for(var i = 0; i < this.stacks; i++) {
            angDiff= 2*Math.PI/this.slices;
            ang=0;

            for(var j=0; j<this.slices; j++){
                this.vertices.push(-Math.sin(ang)*hRadius, Math.cos(ang)*hRadius, h*(i+1));
    
                this.indices.push(j+(i*this.slices), ((j+1)%this.slices)+i*this.slices, j+((i+1)*this.slices));
                this.indices.push(j+((i+1)*this.slices), ((j+1)%this.slices)+i*this.slices, ((j+1)%this.slices)+(i+1)*this.slices);
            
                if (Math.abs(hRadiusDif) < 0.0001) {
                    this.normals.push(
                      Math.cos(ang),
                      Math.sin(ang),
                      0);
                  } else if (hRadiusDif > 0) {
                    this.normals.push(
                      maxheight * Math.cos(ang) / Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2)),
                      maxheight * Math.sin(ang) / Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2)),
                      this.base / Math.sqrt(Math.pow(this.base, 2) + Math.pow(maxheight, 2))
                    );
                  } else {
                    this.normals.push(
                      maxheight * Math.cos(ang) / Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2)),
                      maxheight * Math.sin(ang) / Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2)),
                      this.top / Math.sqrt(Math.pow(this.top, 2) + Math.pow(maxheight, 2))
                    );
                  }
                  
                  this.texCoords.push(j / this.slices, (i+1) / this.stacks);
                
                ang+=angDiff;
            }
            hRadius = hRadius-hRadiusDif;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


  /**
  * Updates texture coords, with given length_s and length_t
  */
  updateTexCoords(length_s, length_t) {
    }
}