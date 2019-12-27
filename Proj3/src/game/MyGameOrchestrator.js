class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameState = "move";
        this.moveState = "pickPiece";

        this.gameboards = new MyGameboards(scene);
        this.gameSequence = new MyGameSequence();
        this.theme = [];
        this.animator = [];

        this.tempGameMove = new MyGameMove();
    }

    processPick(id, obj) {
        var pickInfo = JSON.parse(obj);

        if (this.gameState == "move") {

            if (this.moveState == "pickPiece") {
                if (pickInfo.type == "piece") {
                    var piece = this.gameboards.getPiece(id, pickInfo.player);
                    this.tempGameMove.setPiece(piece);
                    this.moveState = "pickDestTile";
                }
            }
            else if (this.moveState == "pickDestTile") {
                if (pickInfo.type == "tile") {
                    var tile = this.gameboards.getTile(id);
                    this.tempGameMove.setDestTile(tile);

                    this.tempGameMove.animate();
                    
                    this.moveState = "pickPiece";
                }
            }
        }
    }

    display() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();
        this.gameboards.display();
    }



}