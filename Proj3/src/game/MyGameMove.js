class MyGameMove {
    constructor(gameState) {

        this.gameState = gameState;

        this.piece = [];
        this.player = [];
        this.originTile = [];
        this.destinationTile = [];

        this.gameBoard = [];
        this.p1Pieces = [];
        this.p2Pieces = [];
    }

    setPiece(piece) {
        this.piece = piece;
        this.player = piece.player;
        this.originTile = piece.getTile();
    }

    setDestTile(tile) {
        this.destinationTile = tile;
    }

    playMove() {
        this.originTile.unsetPiece();
        this.gameBoard = [...this.gameState.prolog.mainBoard];
        this.p1Pieces = [...this.gameState.prolog.p1Pieces];
        this.p2Pieces = [...this.gameState.prolog.p2Pieces];
    }

    removeMove() {
        this.destinationTile.unsetPiece();
    }

    getBoardsState() {
        return [this.gameBoard, this.p1Pieces, this.p2Pieces];
    }

    startMove() {
        this.originTile.unsetPiece();
    }

    finishMove() {
        this.destinationTile.setPiece(this.piece);
    }

    resetMove() {
        this.originTile.setPiece(this.piece);
    }

    clone(gameMove) {
        this.piece = gameMove.piece;
        this.player = gameMove.player;
        this.originTile = gameMove.originTile;
        this.destinationTile = gameMove.destinationTile;

        this.gameBoard = gameMove.gameBoard;
        this.p1Pieces = gameMove.p1Pieces;
        this.p2Pieces = gameMove.p2Pieces;
    }

    clear() {
        this.piece = null;
        this.destinationTile = null;
        this.originTile = null;
        this.gameBoard = null;
    }

}