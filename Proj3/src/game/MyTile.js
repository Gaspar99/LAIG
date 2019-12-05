class MyTile extends CGFobject {
    constructor(scene, board, size, piece){
        super(scene);

        this.board = board;
        this.piece = piece;

        this.square = new MyRectangle(-size/2.0, size/2.0, -size/2.0, size/2.0);
    }

    setPiece(piece) {
        this.piece = piece;
    }

    unsetPiece() {
        this.piece = null;
    }

    display() {
        this.square.display();
    }
}