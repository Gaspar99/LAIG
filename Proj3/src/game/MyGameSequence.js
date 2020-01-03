class MyGameSequence {
    constructor() {

        this.gameMoves = [];
    }

    pushGameMove(gameMove) {
        var newGameMove = { ...gameMove };
        this.gameMoves.push(newGameMove);
    }

    popGameMove() {
        return this.gameMoves.pop();
    }
}