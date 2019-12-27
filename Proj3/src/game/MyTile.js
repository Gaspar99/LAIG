class MyTile {
    constructor(scene, board, size, piece, line, column){
        this.scene = scene;

        this.board = board;
        this.piece = piece;
        this.size = size;
        this.pickable = false;
        this.line = line;
        this.column = column;
        this.id = line * 4 + column + 1;

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
        this.piece.setTile(this);
    }

    unsetPiece() {
        this.piece = null;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2.0, 1.0, 0.0, 0.0);
        this.material.apply();

        if (this.pickable) {
            this.scene.registerForPick(this.id, this.jsonString);
        }

        this.square.display();
        this.scene.clearPickRegistration();

        this.scene.popMatrix();
    }
}