/**
 * MyRectangle class, creates a rectangle using vertices
 */
class MyRectangle extends CGFobject {
	/**
     * Creates rectangle object
     * @argument scene XML scene
     * @argument x1 First x coordinate
	 * @argument x2 Second x coordinate
	 * @argument y1 First y coordinate
	 * @argument y2 Second y coordinate
     */
	constructor(scene, x1, x2, y1, y2) {
		super(scene);
		
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0		//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			1, 3, 2
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [];
		this.updateTexCoords(1, 1);
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
  	* Updates texture coords, with given length_s and length_t
  	*/
	updateTexCoords(length_s, length_t) {

		//0
		this.texCoords[0] = 0;
		this.texCoords[1] = 0;

		//1
		this.texCoords[2] = 1/length_s;
		this.texCoords[3] = 0;

		//2
		this.texCoords[4] = 0;
		this.texCoords[5] = 1/length_t;

		//3
		this.texCoords[6] = 1/length_s;
		this.texCoords[7] = 1/length_t;

		this.updateTexCoordsGLBuffers();
	}
}

