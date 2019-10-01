var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameras = [];
        this.camerasIDs = [];

        //Reads the views from the scene graph.
        for (var key in this.graph.views) {

            if (this.graph.views.hasOwnProperty(key)) {
                var view = this.graph.views[key];

                this.camerasIDs.push(view[1]);

                var newCamera;

                if (view[0] == "perspective") 
                    newCamera = new CGFcamera(view[6] * DEGREE_TO_RAD, view[2], view[3], view[4], view[5]);
                else if (view[0] == "ortho") 
                    newCamera = new CGFcameraOrtho(view[7], view[8], view[10], view[9], view[2], view[3], view[4], view[5], view[6]);
                
                this.cameras.push(newCamera);
            }
        }

        this.selectedView = this.camerasIDs[0];
        this.interface.gui.add(this, 'selectedView', this.camerasIDs).name('Selected View').onChange(this.updateActiveCamera.bind(this));

        this.camera = this.cameras[0];
        this.interface.setActiveCamera(this.camera);
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Loads the textures defines in the XML file.
     */
    loadTextures() {
    
        this.texturesIDs = [];
        this.textures = [];

        for (var key in this.graph.textures) { 

            if (this.graph.textures.hasOwnProperty(key)) {
                var texture = this.graph.textures[key];

                this.texturesIDs.push(texture[0]); 
                this.textures.push(new CGFtexture(this, texture[1]));
            }
        }
    }

    loadMaterials() {

        this.materialsIDs = [];
        this.materials = [];

        for (var key in this.graph.materials) { 

            if (this.graph.materials.hasOwnProperty(key)) {
                var material = this.graph.materials[key];

                this.materialsIDs.push(material[0]);

                var newMaterial = new CGFappearance(this);

                newMaterial.setShininess(material[1]);
                newMaterial.setEmission(material[2][0], material[2][1], material[2][2], material[2][3]);
                newMaterial.setAmbient(material[3][0], material[3][1], material[3][2], material[2][3]);
                newMaterial.setDiffuse(material[4][0], material[4][1], material[4][2], material[4][3]);
                newMaterial.setSpecular(material[5][0], material[4][1], material[4][2], material[4][3]);

                this.materials.push(newMaterial);
            }
        }

    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initCameras();

        this.initLights();

        this.loadTextures();

        this.loadMaterials();

        this.sceneInited = true;
    }

    updateActiveCamera() {
        this.camera = this.cameras[this.camerasIDs.indexOf(this.selectedView)];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        if(this.sceneInited) {
            this.updateProjectionMatrix();
            this.loadIdentity();

            // Apply transformations corresponding to the camera position relative to the origin
            this.applyViewMatrix();
        }

        this.pushMatrix();
        this.axis.display();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}