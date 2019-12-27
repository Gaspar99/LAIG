class MyTile {
    constructor(scene, board, size, piece, line, column){
        this.scene = scene;

        this.board = board;
        this.setPiece(piece);
        this.size = size;
        this.pickable = false;
        this.line = line;
        this.column = column;
        this.id = line * 4 + column + 1;

        this.xPos = [];
        this.zPos = [];

        var info = {
            type: "tile",
            line: this.line,
            column: this.column
        }
        this.jsonString = JSON.stringify(info);

        this.material = new CGFappearance(this.scene);
        this.material.loadTexture("scenes/images/tile.png");
        this.square = new MyRectangle(scene, -size/2.0, size/2.0, -size/2.0, size/2.0);
    }

    setPiece(piece) {
        this.piece = piece;
        (piece == null) ? null : this.piece.setTile(this);
    }

    getPiece() {
        return this.piece;
    }

    unsetPiece() {
        (this.piece == null) ? null : this.piece.unsetTile(); 
        this.piece = null;
    }

    setPickable(pickable) {
        this.pickable = pickable;
    }

    setPosition(xPos, zPos) {
        this.xPos = xPos;
        this.zPos = zPos;
    }

    display() {
        if (this.pickable) {
            this.scene.registerForPick(this.id, this.jsonString);
        }

        this.material.apply();
        
        this.scene.pushMatrix();
        this.scene.translate(this.xPos, 0.0, this.zPos);
        this.scene.rotate(-Math.PI / 2.0, 1.0, 0.0, 0.0);
        this.square.display();
        this.scene.popMatrix();

        if (this.pickable) {
            this.scene.clearPickRegistration();
        }
    }
}