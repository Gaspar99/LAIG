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
        for (var line = 0; line < 4; line++) {
            for (var col = 0; col < 4; col++) {
                this.tiles.push(new MyTile(this.scene, this, this.width / 4.0, null, line, col));
            }
        }
    }

    getTile(index) {
        return this.tiles[index];
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.width, 1, this.height);
        //this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
        this.scene.popMatrix();

        var tileSize = this.width / 4.0;

        var initialXPos = - (this.width / 2.0) + (tileSize / 2.0);
        var initialYPos = - (this.height / 2.0) + (tileSize / 2.0);

        for (var line = 0; line < 4; line++) {
            for (var col = 0; col < 4; col++) {

                var tile = this.tiles[line * 4 + col];

                var xPos = initialXPos + tileSize * col;
                var zPos = initialYPos + tileSize * line;

                (tile.piece == null) ? tile.setPickable(true) : tile.setPickable(false);
                tile.setPosition(xPos, zPos);
                tile.display();

                // Piece
                if (tile.piece != null) {  
                    tile.piece.setPickable(false);
                    tile.piece.setPosition(xPos, zPos);
                    tile.piece.setSize(tileSize / 2.0); 
                    tile.piece.display();
                }
            }
        }

    }
}