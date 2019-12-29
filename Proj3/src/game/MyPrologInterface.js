class MyPrologInterface {
    constructor() {

        // Prolog Boards
        this.mainBoard = [];
        this.whitePieces = [];
        this.brownPieces = [];
        
    }

    sendPrologRequest(requestString, onSuccess, onError) {
    
        var requestPort = 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);
    
        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };
    
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    async sendAsyncPrologRequest(requestString) {
    
        var requestPort = 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, false);
    
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();

        if (request.status === 200) 
            return request.response
        else
            throw(new Error('Error getting data'))
    }

    initBoards() {
        this.sendPrologRequest("init_boards", (data) => { this.parseBoards.call(this, data) });
    }

    parseBoards(data) {
        var array = JSON.parse(data.target.response);
        
        this.mainBoard = array[0];
        this.whitePieces = array[1];
        this.brownPieces = array[2];
    }

    async isValidMove(gameMove) {

        var destCol = gameMove.destinationTile.column + 1;
        var destLine = gameMove.destinationTile.line + 1;
        var piece = gameMove.piece.prologId;
        var player = gameMove.piece.prologPlayer;
        var mainBoard = "[[" + this.mainBoard[0] + "]," + "[" + this.mainBoard[1] + "]," + "[" + this.mainBoard[2] + "]," + "[" + this.mainBoard[3] + "]]";
        var whitePieces = "[" + this.whitePieces + "]";
        var brownPieces = "[" + this.brownPieces + "]";

        var requestString = "valid_move("+destLine+","+destCol+","+piece+","+player+","+mainBoard+","+whitePieces+","+brownPieces+")";

        var response = await this.sendAsyncPrologRequest(requestString);

        return (response == "valid");
    }

    gameOver() {
        return false;
    }

    getComputerPlay() {

    }


    parseGameMode(gameMode) {
        switch (gameMode) {
            case "PlayerVsPlayer" : {
                return "1";
            }
        }
    }
}