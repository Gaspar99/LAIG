/**
 * MyTriangle class, creates a tringle using vertices
 */
class MyTriangle extends CGFobject {
	/**
     * Creates rectangle object
     * @argument scene XML scene
     * @argument x1 X coordinate of the first vertice
	 * @argument x2 X coordinate of the second vertice
	 * @argument x3 X coordinate of the third vertice
	 * @argument y1 Y coordinate of the first vertice
	 * @argument y2 Y coordinate of the second vertice
	 * @argument y3 Y coordinate of the third vertice
	 * @argument z1 Z coordinate of the first vertice
	 * @argument z2 Z coordinate of the second vertice
	 * @argument z3 Z coordinate of the third vertice
     */
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		
		this.x1 = x1;
		this.y1 = y1;
		this.z1 = z1;
        this.x2 = x2;
		this.y2 = y2;
		this.z2 = z2;
        this.x3 = x3;
		this.y3 = y3;
		this.z3 = z3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		//Facing Z positive
		this.normals = [
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
		var a = Math.sqrt(Math.pow(this.x2-this.x1, 2) + Math.pow(this.y2-this.y1,2) + Math.pow(this.z2-this.z1,2));
		var b = Math.sqrt(Math.pow(this.x3-this.x2, 2) + Math.pow(this.y3-this.y2,2) + Math.pow(this.z3-this.z2,2));
		var c = Math.sqrt(Math.pow(this.x1-this.x3, 2) + Math.pow(this.y1-this.y3,2) + Math.pow(this.z1-this.z3,2));

		var cos_ang = (Math.pow(a,2)-Math.pow(b,2)+Math.pow(c,2)) / (2*a*c);
		var sin_ang = Math.sqrt(1-Math.pow(cos_ang,2));

		this.texCoords[0] = 0;
		this.texCoords[1] = 0;
		this.texCoords[2] = a/length_s;
		this.texCoords[3] = 0;
		this.texCoords[4] = (c*cos_ang)/length_s;
		this.texCoords[5] = (c*sin_ang)/length_t;

		this.updateTexCoordsGLBuffers();
	}
}