class MyPrologInterface {
    constructor() {

        this.prologBoards = {
            mainBoard: [],
            whitePieces: [],
            brownPieces: []
        }
    }

    initBoards() {
        this.sendPrologRequest("init_boards", this.getBoards);
    }

    getBoards(data) {
        console.log(data.target.response);

        //TODO parsing of response string to initialize boards
    }

    sendPrologRequest(requestString, onSuccess, onError, port) {
    
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);
    
        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };
    
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    isValidMove(gameMove) {
        return true;
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