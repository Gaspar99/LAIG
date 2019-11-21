class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        
        this.rectangle = new MyRectangle(scene, 0.5, 1.0, -1.0, -0.5);
        
        this.rttTexture = new CGFtextureRTT(scene, scene.gl.canvas.width, scene.gl.canvas.height);

        this.cameraShader = new CGFshader(scene.gl, "shaders/securityCamera.vert", "shaders/securityCamera.frag");
        
        this.cameraShader.setUniformsValues({ uSampler: 0});

        this.cameraShader.setUniformsValues({ timeFactor: 0});
    }

    attachFrameBuffer() {
        this.rttTexture.attachToFrameBuffer();
    }

    detachFrameBuffer() {
        this.rttTexture.detachFromFrameBuffer();
    }

    updateTextureTime(time) {
        this.cameraShader.setUniformsValues({ timeFactor: time / 100 % 1000 });
    }   

    display() {
        this.rttTexture.bind(0);

        this.scene.setActiveShader(this.cameraShader);

        this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);

        this.rttTexture.unbind(0);
    }
}