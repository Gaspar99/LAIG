class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        
        this.rectangle = new MyRectangle(scene, 0, 1, 0, 1);
        
        this.rttTexture = new CGFtextureRTT(scene, scene.gl.canvas.width, scene.gl.canvas.height);

        this.cameraShader = new CGFshader(scene.gl, "shaders/securityCamera.vert", "shaders/securityCamera.frag");
        
        this.cameraShader.setUniformsValues({ uSampler: 0});

        this.cameraMaterial = new CGFappearance(scene);
        this.cameraMaterial.setTexture(this.rttTexture);
        this.cameraMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    attachFrameBuffer() {
        this.rttTexture.attachToFrameBuffer();
    }

    detachFrameBuffer() {
        this.rttTexture.detachFromFrameBuffer();
    }

    display() {
        this.rttTexture.bind(0);

        this.scene.setActiveShader(this.cameraShader);

        this.cameraMaterial.apply();
        this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);

        this.rttTexture.unbind(0);
    }
}