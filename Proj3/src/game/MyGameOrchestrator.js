class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameState = "move";

        this.currentPlayer = "p1"; 
        this.moveState = "pickPiece";

        this.gameboards = new MyGameboards(scene);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(scene, this);
        this.theme = [];

        this.tempGameMove = new MyGameMove();
    }

    processPick(id, obj) {
        var pickInfo = JSON.parse(obj);

        if (this.gameState == "move") {

            if (this.moveState == "pickPiece") {
                if (pickInfo.type == "piece") {
                    if (pickInfo.player == this.currentPlayer) {
                        var piece = this.gameboards.getPiece(id, pickInfo.player);
                        this.tempGameMove.setPiece(piece);
                        this.animator.setPickingAnimation(piece);
                        this.moveState = "pickDestTile";
                    }
                }
            }
            else if (this.moveState == "pickDestTile") {
                if (pickInfo.type == "tile") {
                    var tile = this.gameboards.getTile(id);
                    this.tempGameMove.setDestTile(tile);
                    // TODO: comunication with prolog to check if move is valid
                    this.animator.setGameMoveAnimation(this.tempGameMove);
                    this.moveState = "inMoveAnimation";
                }
            }  
        }
    }

    update(time) {
        this.animator.update(time);
    }

    changePlayer() {
        this.currentPlayer = ((this.currentPlayer == "p1") ? "p2" : "p1");
    }

    display() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();
        this.gameboards.display();

        if (this.gameState == "move") {
            if (this.moveState == "pickDestTile") {
                this.animator.animateSelectedPiece();
            }
            else if (this.moveState == "inMoveAnimation") {
                if (!this.animator.animateMove()) { // Animation ended
                    this.tempGameMove.finishMove();
                    this.moveState = "pickPiece";
                    this.changePlayer();
                    this.gameState = "changePlayer";
                    this.animator.setCameraChangeAnimation();
                }
            }
        }
        else if (this.gameState == "changePlayer") {
            if (!this.animator.changingCamera)  {
                this.gameState = "move";
            }
        }
    }



}