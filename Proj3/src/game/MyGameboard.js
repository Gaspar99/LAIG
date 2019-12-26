class MyGameboard {
    constructor(scene, componentID, width, height) {
        this.scene = scene;

        this.componentID = componentID;
        this.width = width;
        this.height = height;
        this.tiles = [];

        this.setDefaultValues();
        this.buildTiles();
    }

    setDefaultValues() {
        this.transfMatrix = mat4.create();
        this.materialID = "defaultMaterial";
        this.textureID = "defaultTexture";
    }

    buildTiles() {
        for (var i = 0; i < 4 * 4; i++) {
            this.tiles.push(new MyTile(this.scene, this, this.width / 4.0, null));
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.width, 1, this.height);
        //this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
        this.scene.popMatrix();

        for (var line = 0; line < 4; line++) {
            for (var col = 0; col < 4; col++) {

                var xPos = - (this.width / 2.0) + (this.width / 4.0) * col;
                var zPos = - (this.height / 2.0) + (this.height / 4.0) * line;

                this.scene.pushMatrix();
                this.scene.translate(xPos, 0, zPos);
                this.tiles[line * 4 + col].display();
                this.scene.popMatrix();
            }
        }
    }
}