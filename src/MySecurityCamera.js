class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);

        this.texture = null;
		this.appearance = null;
        
        this.rectangle = new MyRectangle(this.scene, this.scene.gl.canvas.width * (3/4), this.scene.gl.width, 0, this.scene.gl.height * (1/4));

        this.createTexture();
    }

    createTexture() {
        this.appearance = new CGFappearance(this.scene);

        this.rttTexture = new CGFtextureRTT(this.scene, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
        this.appearance.setTexture(this.rttTexture);
		this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    attachFrameBuffer() {
        this.rttTexture.attachToFrameBuffer();
    }

    detachFrameBuffer() {
        this.rttTexture.detachFromFrameBuffer();
    }

    display() {
        this.appearance.apply();
        this.rectangle.display();
    }
}