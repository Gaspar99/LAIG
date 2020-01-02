class MyPlayState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameInfo = gameOrchestrator.gameInfo;
        this.gameboards = gameOrchestrator.gameboards;

        this.currentPlayer = "p1";
        this.moveState = "pickPiece";

        this.animator = new MyAnimator(scene, this);
        this.prolog = new MyPrologInterface(this.gameboards);

        this.setUpInitialCameraPosition();

        this.tempGameMove = new MyGameMove();
    }

    processPick(id, pickInfo) {

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
                        this.tempGameMove.removeOriginTilePiece();
                        this.animator.setGameMoveAnimation(this.tempGameMove);
                        this.moveState = "inMoveAnimation";
                        this.checkGameOver();
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

    update(time) {
        this.animator.update(time);

        if (
            ((this.gameInfo.gameMode == "PlayerVsComputer" && this.currentPlayer == "p2") ||
                (this.gameInfo.gameMode == "ComputerVsPlayer" && this.currentPlayer == "p1") ||
                (this.gameInfo.gameMode == "ComputerVsComputer")) && this.moveState != "inMoveAnimation" && this.prolog.boardsInited
        ) {
            this.moveState = "inMoveAnimation";
            this.prolog.getComputerMove(this.gameInfo.difficultyLevel, this.currentPlayer).then((gameMove) => {
                if (gameMove) {
                    this.tempGameMove = gameMove;
                    this.tempGameMove.removeOriginTilePiece();
                    this.animator.setGameMoveAnimation(this.tempGameMove);
                    this.checkGameOver();
                }
                else {
                    console.log("No more valid moves");
                }
            });
        }
    }

    setUpInitialCameraPosition() {
        var angle = 0.0;

        switch (this.gameInfo.gameMode) {
            case "PlayerVsPlayer":
            case "PlayerVsComputer": {
                angle = Math.PI / 2.0;
                break;
            }
            case "ComputerVsPlayer" : {
                angle = - Math.PI / 2.0;
                console.log("GAYY");
                break;
            }
            default: {
                break;
            }
        }

        this.scene.camera.orbit(CGFcameraAxis.Y, angle);
    }

    changePlayer() {
        this.currentPlayer = ((this.currentPlayer == "p1") ? "p2" : "p1");
    }

    finishMove() {
        this.tempGameMove.finishMove();

        if (this.gameState != "gameOver") {
            if (this.gameInfo.gameMode == "PlayerVsPlayer") {
                this.moveState = "changePlayer";
                this.animator.setCameraChangeAnimation();
            }
            else {
                this.moveState = "pickPiece";
            }

            this.changePlayer();
        }
    }

    checkGameOver() {
        this.prolog.gameOver(this.tempGameMove).then((gameOver) => {
            if (gameOver) {
                console.log("Game Over");
                this.gameState = "gameOver";
            }
        });
    }

    display() {
        this.animator.animate();

        if (this.moveState == "changePlayer") {
            if (!this.animator.changingCamera) {
                this.moveState = "pickPiece";
            }
        }
    }


}