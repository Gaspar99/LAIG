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
        this.player1PiecesBoard = new MyGameboard(this.scene, componentID, width, height);
    }

    setPlayer2PiecesBoard(componentID, width, height) {
        this.player2PiecesBoard = new MyGameboard(this.scene, componentID, width, height);
    }

    display() {
        // Display main board in the center
        this.mainGameboard.display();

        // Display player 1 pieces board on the left side of the main board
        this.scene.pushMatrix();
        this.scene.translate(-this.width/2 + 1, 0, 0);
        this.player1PiecesBoard.display();
        this.scene.popMatrix();

        // Display player 2 pieces board on the left side of the main board
        this.scene.pushMatrix();
        this.scene.translate(+this.width/2 + 1, 0, 0);
        this.player2PiecesBoard.display();
        this.scene.popMatrix();
    }
}