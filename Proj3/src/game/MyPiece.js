

class MyPiece {
    constructor(scene, id, pieceType, player) {
        this.scene = scene;

        this.pieceType = pieceType;
        this.player = player;
        this.pickable = false;

        this.xPos = [];
        this.zPos = [];
        this.size = [];
        this.animationMatrix = mat4.create();

        var info = {
            type: "piece",
            player: this.player,
            pieceType: this.pieceType
        };
        this.jsonString = JSON.stringify(info);

        this.id = (this.player == "p1") ? id + 20 : id + 30;

        this.prologPlayer = ((player == "p1") ? "1" : "2");
        this.prologId = [];

        this.componentID = [];
        this.setComponentID();
        this.setDefaultValues();
    }

    setPickable(pickable) {
        this.pickable = pickable;
    }

    setPosition(xPos, zPos) {
        this.xPos = xPos;
        this.zPos = zPos;
    }

    setSize(size) {
        this.size = size;
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
                this.prologId = "1" + this.prologPlayer;
                break;
            }
            case "cube": {
                this.componentID = this.player + "CubePiece";
                this.prologId = "5" + this.prologPlayer;
                break;
            }
            case "cylinder": {
                this.componentID = this.player + "CylinderPiece";
                this.prologId = "7" + this.prologPlayer;
                break;
            }
            case "sphere": {
                this.componentID = this.player + "SpherePiece";
                this.prologId = "9" + this.prologPlayer;
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

    setAnimationMatrix(ma) {
        this.animationMatrix = ma;
    }

    unsetTile() {
        this.tile = null;
    }

    getTile() {
        return this.tile;
    }

    display() {
        if (this.pickable) {
            this.scene.registerForPick(this.id, this.jsonString);
        }

        this.scene.pushMatrix();
        this.scene.translate(this.xPos, 0.0, this.zPos);
        this.scene.scale(this.size, this.size, this.size);
        this.scene.multMatrix(this.animationMatrix);
        this.scene.graph.processNode(this.componentID, this.transfMatrix, this.materialID, this.textureID, 1.0, 1.0);
        this.scene.popMatrix();

        if (this.pickable) {
            this.scene.clearPickRegistration();
        }
    }
}