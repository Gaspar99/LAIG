class MyGameboards {
    constructor(scene) {
        this.scene = scene;

        this.mainGameboard = [];
        this.player1PiecesBoard = [];
        this.player2PiecesBoard = [];
    }

    setMainGameboard(componentID, width, height) {
        this.mainGameboard = new MyGameboard(this.scene, componentID, width, height);
    }

    setPlayer1PiecesBoard(componentID, width, height) {
        this.player1PiecesBoard = new MyAuxiliaryBoard(this.scene, componentID, width, height, "p1");
        this.player1PiecesBoard.setPosition(-this.mainGameboard.width, 0.0);
    }

    setPlayer2PiecesBoard(componentID, width, height) {
        this.player2PiecesBoard = new MyAuxiliaryBoard(this.scene, componentID, width, height, "p2");
        this.player2PiecesBoard.setPosition(+this.mainGameboard.width, 0.0);
    }

    getPiece(id, player) {
        var index = ((player == "p1") ? (id - 20) : (id - 30)) - 1;
        return (player == "p1") ? this.player1PiecesBoard.getPiece(index) : this.player2PiecesBoard.getPiece(index);
    }

    getTile(id) {
        return this.mainGameboard.getTile(id - 1);
    }

    display() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();
        
        // Display main board in the center
        this.mainGameboard.display();

        // Display player 1 pieces board on the left side of the main board
        this.player1PiecesBoard.display();

        // Display player 2 pieces board on the right side of the main board
        this.player2PiecesBoard.display();
    }
}