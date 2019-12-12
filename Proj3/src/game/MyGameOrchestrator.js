class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameboard = [];
        this.player1PiecesBoard = [];
        this.player2PiecesBoard = [];
        this.theme = [];
        this.animator = [];
    }

    setGameboard(component, width, height) {
        this.gameboard = new this.gameboard(this.scene, component, width, height);
    }

    setPlayer1PiecesBoard(component, width, height) {
        this.player1PiecesBoard = new this.gameboard(this.scene, component, width, height);
    }

    setPlayer2PiecesBoard(component, width, height) {
        this.player2PiecesBoard = new this.gameboard(this.scene, component, width, height);
    }


}