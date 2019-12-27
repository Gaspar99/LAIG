

class MyPiece  {
    static globalID = 0;

    constructor(scene, id, pieceType, player){
        this.scene = scene;

        this.pieceType = pieceType;
        this.player = player;
        this.pickable = false;

        var info = {
            type: "piece",
            player: this.player,
            pieceType: this.pieceType
        };
        this.jsonString = JSON.stringify(info);
        
        this.id = (this.player == "p1") ? id + 20 : id + 30;

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
        switch (this.pieceType) {
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
        if (this.pickable) {
            this.scene.registerForPick(this.id, this.jsonString);
        }

        this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
        this.scene.clearPickRegistration();
    }
}