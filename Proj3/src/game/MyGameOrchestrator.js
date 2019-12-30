class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameInfo = {
            gameMode: "PlayerVsPlayer",
            difficultyLevel: 1,
            player1Score: 0,
            player2Score: 0
        }

        this.gameState = "move";
        this.currentPlayer = "p1";
        this.moveState = "pickPiece";

        this.gameboards = new MyGameboards(scene);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(scene, this);
        this.prolog = new MyPrologInterface();
        this.theme = [];

        this.tempGameMove = new MyGameMove();

        this.prolog.initBoard();
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

                    // Comunication with prolog to check if move is valid
                    this.prolog.isValidMove(this.tempGameMove).then((valid) => {
                        if (valid) {
                            console.log("Valid Move");
                            this.tempGameMove.removeOriginTilePiece();
                            this.animator.setGameMoveAnimation(this.tempGameMove);
                            this.moveState = "inMoveAnimation";

                            this.prolog.gameOver(this.tempGameMove).then((gameOver) => {
                                if (gameOver) {
                                    console.log("Game Over");
                                    this.gameState = "gameOver";
                                }
                                else {
                                    console.log("Not Game Over");
                                }
                            })
                        }
                        else {
                            console.log("Invalid Move");
                        }
                    });
                }
                else if (pickInfo.type == "piece" && pickInfo.player == this.currentPlayer) {
                    var oldPiece = this.tempGameMove.piece;
                    this.animator.setDeselectAnimation(oldPiece);

                    var piece = this.gameboards.getPiece(id, pickInfo.player);
                    if (oldPiece.id != piece.id) {
                        this.tempGameMove.setPiece(piece);
                        this.animator.setPickingAnimation(piece);
                    }
                    else {
                        this.moveState = "pickPiece";
                    }
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

    finishMove() {
        this.tempGameMove.finishMove();
        if (this.gameState != "gameOver") {
            this.gameState = "changePlayer";
            this.animator.setCameraChangeAnimation();
        }
    }

    display() {
        this.gameboards.display();


        if (this.animator.animations.hasOwnProperty("picking")) {
            if (!this.animator.animateSelectedPiece()) {
                delete this.animator.animations["picking"];
            }
        }

        if (this.animator.animations.hasOwnProperty("deselect")) {
            if (!this.animator.animateDeselectedPiece()) {
                delete this.animator.animations["deselect"];
            }
        }

        if (this.animator.animations.hasOwnProperty("movePiece")) {
            if (!this.animator.animateMove()) {
                delete this.animator.animations["movePiece"];
                this.finishMove();
            }
        }

        if (this.gameState == "changePlayer") {
            if (!this.animator.changingCamera) {
                this.gameState = "move";
                this.moveState = "pickPiece";
                this.changePlayer();
            }
        }

    }



}