class MyGameSequence {
    constructor() {

        this.gameMoves = [];
    }

    pushGameMove(gameMove) {
        this.gameMoves.push(gameMove);
    }

    popPlayerGameMove(player) {
        var tempStack = [];
        
        do {
            var lastGameMove = this.gameMoves.pop();

            tempStack.push(lastGameMove);

        } while(lastGameMove.player != player && this.gameMoves.length > 0);

        if (lastGameMove.player != player) {
            this.gameMoves.push(...tempStack);
            return null;
        }

        var playerGameMove = tempStack.pop();
        this.gameMoves.push(...tempStack);

        return playerGameMove;
    }

    getLastMoveBy(player) {
        for (var i = this.gameMoves.length - 1; i >= 0; i++) {
            if (this.gameMoves[i].player == player)
                return this.gameMoves[i];
        }
    }
}