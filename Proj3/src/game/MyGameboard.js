class MyGameboard {
    constructor(scene, componentID, width, height) {
        this.scene = scene;

        this.componentID = componentID;
        this.width = width;
        this.height = height;

        this.setDefaultValues();
    }

    setDefaultValues() {
        this.transfMatrix = mat4.create();
        this.materialID = "defaultMaterial";
        this.textureID = "defaultTexture";
    }

    display() {
        this.scene.pushMatrix();

        this.scene.scale(this.width, 1, this.height);
        this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);

        this.scene.popMatrix();
    }
}