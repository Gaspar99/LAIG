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
    }

    setPlayer2PiecesBoard(componentID, width, height) {
        this.player2PiecesBoard = new MyAuxiliaryBoard(this.scene, componentID, width, height, "p2");
    }

    getPiece(id, player) {
        var index = ((player == "p1") ? id - 20 : id - 30) - 1;
        return (player == "p1") ? this.player1PiecesBoard.getPiece(index) : this.player2PiecesBoard.getPiece(index);
    }

    getTile(id) {
        return this.mainGameboard.getTile(id - 1);
    }

    display() {
        // Display main board in the center
        this.mainGameboard.display();

        // Display player 1 pieces board on the left side of the main board
        this.scene.pushMatrix();
        this.scene.translate(-this.mainGameboard.width + 1, 0, 0);
        this.player1PiecesBoard.display();
        this.scene.popMatrix();

        // Display player 2 pieces board on the right side of the main board
        this.scene.pushMatrix();
        this.scene.translate(+this.mainGameboard.width + 1, 0, 0);
        this.player2PiecesBoard.display();
        this.scene.popMatrix();  
    }
}