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
        var id = 1;
        
        // Cone
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "cone", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "cone", this.player)));

        // Cube
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "cube", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "cube", this.player)));

        // Cylinder
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "cylinder", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "cylinder", this.player)));

        // Sphere
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "sphere", this.player)));
        this.tiles.push(new MyTile(this.scene, this, tileSize, new MyPiece(this.scene, id++, "sphere", this.player)));
    }

    getPiece(index) {
        return this.tiles[index].getPiece();
    }

    display() {
        this.scene.pushMatrix();
        this.scene.scale(this.width, 1, this.height);
        //this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
        this.scene.popMatrix();

        var tileSize = this.width / 2.0;

        var initialXPos = - (this.width / 2.0) + (tileSize / 2.0);
        var initialYPos = - (this.height / 2.0) + (tileSize / 2.0);

        for (var line = 0; line < 4; line++) {
            for (var col = 0; col < 2; col++) {

                var tile = this.tiles[line * 2 + col];

                var xPos = initialXPos + tileSize * col;
                var zPos = initialYPos + tileSize * line;
                
                tile.setPickable(false);
                tile.setPosition(xPos, zPos);
                tile.display();

                // Piece
                if (tile.piece != null) {
                    tile.piece.setPickable(true);
                    tile.piece.setPosition(xPos, zPos);
                    tile.piece.setSize(tileSize / 2.0);
                    tile.piece.display();              
                }           
            }
        }
    }
}