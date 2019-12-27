class MyGameSequence {
    constructor() {

        this.gameMoves = [];
    }

    addGameMove(gameMove) {
        this.gameMoves.push(gameMove);
    }

    undoGameMove() {
        this.gameMoves.pop();
    }
}