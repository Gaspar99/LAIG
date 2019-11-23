/**
* Security camera object located in bottom right corner of screen with shader effects
*/
class MySecurityCamera extends CGFobject {
    /**
     * Constructs security camera object applying render to texture technique
     * @argument scene XML Scene
     * @argument rttTexture Texture used to apply render to texture technique
     */
    constructor(scene, rttTexture) {
        super(scene);
        
        this.rectangle = new MyRectangle(scene, 0.5, 1.0, -1.0, -0.5);
        
        this.rttTexture = rttTexture;
        this.noiseTexture = new CGFtexture(scene, "scenes/images/noise.jpg");

        this.cameraShader = new CGFshader(scene.gl, "shaders/securityCamera.vert", "shaders/securityCamera.frag");
        
        this.cameraShader.setUniformsValues({ uSampler: 0});
        this.cameraShader.setUniformsValues({ uSampler2: 1});

        this.cameraShader.setUniformsValues({ timeFactor: 0});
    }

    /**
     * Ataches RTT Texture to frame buffer
     */
    attachFrameBuffer() {
        this.rttTexture.attachToFrameBuffer();
    }

    /**
     *  Detaches RTT Texture to frame buffer
     */
    detachFrameBuffer() {
        this.rttTexture.detachFromFrameBuffer();
    }

    /**
     * Updates timeFactor uniform value used in shader for security camera
     * @param time acumulates time received from scene
     */
    updateTextureTime(time) {
        this.cameraShader.setUniformsValues({ timeFactor: time / 1000 % 10000 });
    }   

    /**
     * Displays the security camera on the bottom right corner of the screen
     * with shaders effects
     */
    display() {
        this.rttTexture.bind(0);
        this.noiseTexture.bind(1);

        this.scene.setActiveShader(this.cameraShader);

        this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);

        this.rttTexture.unbind(0);
        this.noiseTexture.unbind(1);
    }
}