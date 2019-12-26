class MyPiece  {
    constructor(scene, type, player){
        this.scene = scene;

        this.type = type;
        this.player = player;

        this.componentID = [];
        this.setComponentID();
        this.setDefaultValues();
    }

    setDefaultValues() {
        this.transfMatrix = mat4.create();
        this.materialID = "defaultMaterial";
        this.textureID = "defaultTexture";
    }

    setComponentID() {
        switch (this.type) {
            case "cone": {
                this.componentID = this.player + "ConePiece";
                break;
            }
            case "cube": {
                this.componentID = this.player + "CubePiece";
                break;
            }
            case "cylinder": {
                this.componentID = this.player + "CylinderPiece";
                break;
            }
            case "sphere": {
                this.componentID = this.player + "SpherePiece";
                break;
            }
            default: {
                break;
            }
        }
    }

    setTile(tile) {
        this.tile = tile;
    }

    display() {
        this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
    }
}