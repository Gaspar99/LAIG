class MyGameMove {
    constructor(gameOrchestrator) {

        this.gameOrchestrator = gameOrchestrator;

        this.piece = [];
        this.originTile = [];
        this.destinationTile = [];

        this.gameBoard = [];
        this.p1Pieces = [];
        this.p2Pieces = [];
    }

    setPiece(piece) {
        this.piece = piece;
        this.originTile = piece.getTile();
    }

    setDestTile(tile) {
        this.destinationTile = tile;
    }

    playMove() {
        this.originTile.unsetPiece();
        this.gameBoard = [...this.gameOrchestrator.prolog.mainBoard];
    }

    getMainBoardState() {
        return this.gameBoard;
    }

    finishMove() {
        this.destinationTile.setPiece(this.piece);
    }

    clear() {
        this.piece = null;
        this.destinationTile = null;
        this.originTile = null;
        this.gameBoard = null;
    }

}