class MyTile {
    constructor(scene, board, size, piece){
        this.scene = scene;

        this.board = board;
        this.piece = piece;
        this.size = size;

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
        this.square.display();
        this.scene.popMatrix();

        if (this.piece != null) {
            this.scene.pushMatrix();
            this.scene.scale(this.size / 2, this.size / 2, this.size / 2);
            this.piece.display();
            this.scene.popMatrix();
        }
    }
}