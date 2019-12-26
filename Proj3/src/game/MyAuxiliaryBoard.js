class MyAuxiliaryBoard {
    constructor(scene, componentID, width, height, player) {
        this.scene = scene;

        this.componentID = componentID;
        this.width = width;
        this.height = height;
        this.player = player;
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
        var tileSize = this.width / 2;
        
        // Cone
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "cone", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "cone", this.player)));

        // Cube
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "cube", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "cube", this.player)));

        // Cylinder
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "cylinder", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "cylinder", this.player)));

        // Sphere
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "sphere", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, "sphere", this.player)));
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.width, 1, this.height);
        //this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
        this.scene.popMatrix();

        for (var line = 0; line < 4; line++) {
            for (var col = 0; col < 2; col++) {

                var xPos = - (this.width / 2.0) + (this.width / 2.0) * col;
                var zPos = - (this.height / 2.0) + (this.height / 4.0) * line;
                
                this.scene.pushMatrix();
                this.scene.translate(xPos, 0, zPos);
                this.tiles[line * 2 + col].display();
                this.scene.popMatrix();
            }
        }
    }
}