/**
 * MySphere class, creates a sphere using vertices
 */
class MySphere extends CGFobject {
  /**
     * Creates sphere object
     * @argument scene XML scene
     * @argument radius Radius of the sphere
     * @argument slices Number of parts in the horizontal axis
     * @argument stacks Number of parts in the vertical axis
     */
  constructor(scene, radius, slices, stacks) {
    super(scene);

    this.slices = slices;
    this.stacks = stacks;
    this.radius = radius;
    
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (let latNumber = 0; latNumber <= this.stacks; ++latNumber) {
      let theta = latNumber * Math.PI / this.stacks;
      let sinTheta = Math.sin(theta);
      let cosTheta = Math.cos(theta);
      for (let longNumber = 0; longNumber <= this.slices; ++longNumber) {
        let phi = longNumber * 2 * Math.PI / this.slices;
        let sinPhi = Math.sin(phi);
        let cosPhi = Math.cos(phi);
        let x = cosPhi * sinTheta;
        let y = sinPhi * sinTheta;
        let z = cosTheta;
        let u = 1 - (longNumber / this.slices);
        let v = 1 - (latNumber / this.stacks);
        this.vertices.push(this.radius * x);
        this.vertices.push(this.radius * y);
        this.vertices.push(this.radius * z);
        this.normals.push(x);
        this.normals.push(y);
        this.normals.push(z);
        this.texCoords.push(u);
        this.texCoords.push(v);
      }
    }

    for (let latNumber = 0; latNumber < this.stacks; ++latNumber) {
      for (let longNumber = 0; longNumber < this.slices; ++longNumber) {
        let first = (latNumber * (this.slices + 1)) + longNumber;
        let second = first + this.slices + 1;
        this.indices.push(first);
        this.indices.push(second);
        this.indices.push(first + 1);
        this.indices.push(first + 1);
        this.indices.push(second);
        this.indices.push(second + 1);
      }
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