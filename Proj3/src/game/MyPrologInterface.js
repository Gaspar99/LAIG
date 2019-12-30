class MyPrologInterface {
    constructor() {

        // Prolog Boards
        this.mainBoard = [];
        
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

    initBoard() {
        this.sendPrologRequest("init_board", (data) => { this.getBoard.call(this, data) });
    }

    getBoard(data) {
        this.parseBoardFromString(data.target.response);
    }

    parseBoardFromString(string) {    
        this.mainBoard = JSON.parse(string);
    }

    parseBoardToString() {
        return "[[" +this.mainBoard[0]+ "],[" +this.mainBoard[1]+ "],[" +this.mainBoard[2]+ "],[" +this.mainBoard[3]+ "]]";
    }

    async isValidMove(gameMove) {

        var destCol = gameMove.destinationTile.column + 1;
        var destLine = gameMove.destinationTile.line + 1;
        var piece = gameMove.piece.prologId;
        var boardString = this.parseBoardToString();

        var requestString = "valid_move("+destLine+","+destCol+","+piece+","+boardString+")";

        var response = await this.sendAsyncPrologRequest(requestString);

        return (response == "true");
    }

    async gameOver(gameMove) {
        
        var destCol = gameMove.destinationTile.column + 1;
        var destLine = gameMove.destinationTile.line + 1;
        var piece = gameMove.piece.prologId;
        var boardString = this.parseBoardToString();

        var requestString = "game_over("+destLine+","+destCol+","+piece+","+boardString+")";

        var response = await this.sendAsyncPrologRequest(requestString);

        var responseArray = JSON.parse(response);

        this.mainBoard = responseArray[0];

        console.log(responseArray[1]);

        return (responseArray[1]);
    }

    getComputerPlay() {

    }
}