class MyGameMove {
    constructor() {

        this.piece = [];
        this.originTile = [];

        this.destinationTile = [];

        this.gameBoard = [];
    }

    setPiece(piece) {
        this.piece = piece;
        this.originTile = piece.getTile();
    }

    setDestTile(tile) {
        this.destinationTile = tile;
    }

    clear() {
        this.piece = null;
        this.destinationTile = null;
        this.originTile = null;
        this.gameBoard = null;
    }

    animate() {
        this.originTile.unsetPiece();
        this.destinationTile.setPiece(this.piece);
    }

}