class MyGameSequence {
    constructor() {

        this.gameMoves = [];
    }

    pushGameMove(gameMove) {
        this.gameMoves.push(gameMove);
    }

    popPlayerGameMove(player) {
        var tempStack = [];

        var lastGameMove = this.gameMoves.pop();
        while (lastGameMove != undefined && lastGameMove.player != player) {

            tempStack.push(lastGameMove);

            lastGameMove = this.gameMoves.pop();
        }        

        if (lastGameMove == undefined) {
            this.gameMoves.push(...tempStack);
            return null;
        }

        this.gameMoves.push(...tempStack);

        return lastGameMove;
    }

    getLastMoveBy(player) {
        for (var i = this.gameMoves.length - 1; i >= 0; i++) {
            if (this.gameMoves[i].player == player)
                return this.gameMoves[i];
        }
    }
}