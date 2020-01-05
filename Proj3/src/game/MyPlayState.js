class MyPlayState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameboards = gameOrchestrator.gameboards;

        this.currentPlayer = "p1";
        this.moveState = "pickPiece";

        this.maxPlayTime = this.gameInfo.playTime * 1000;
        this.currentPlayTime = this.maxPlayTime;

        this.setUpInitialCameraPosition();

        this.animator = new MyAnimator(scene, this);
        this.prolog = new MyPrologInterface(this);
        this.gui = new MyGUI(scene, this);

        this.tempGameMove = new MyGameMove(this);
    }

    processPick(id, pickInfo) {

        if (this.moveState == "pickPiece" && this.gameInfo.gameMode != "ComputerVsComputer") {
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
                        this.tempGameMove.playMove();

                        var newGameMove = new MyGameMove(this);
                        newGameMove.clone(this.tempGameMove);
                        this.gameOrchestrator.pushGameMove(newGameMove);

                        this.animator.setGameMoveAnimation(this.tempGameMove);
                        this.moveState = "inMoveAnimation";
                        this.checkGameOver();
                    }
                    else {
                        this.gui.errors["invalidMove"] = true;
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

        if (pickInfo.type == "option") {
            if (pickInfo.option == "undo" && this.moveState != "computerPlaying" && this.moveState != "undoingMove") {
                var playerGameMove = this.gameOrchestrator.popPlayerGameMove(this.currentPlayer);

                if (playerGameMove == null)
                    return;

                playerGameMove.removeMove();
                this.animator.setReverseGameMoveAnimation(playerGameMove);
                this.moveState = "undoingMove";
                this.tempGameMove = playerGameMove;
                this.prolog.setBoards(playerGameMove.getBoardsState());

                var adversaryGameMove = this.gameOrchestrator.getLastMoveBy(this.getOpponentPlayer());
                if (adversaryGameMove != undefined)
                    this.prolog.playMove(adversaryGameMove);
            }
            else if (pickInfo.option == "rotateCamera") {
                var direction = ((pickInfo.direction == "left") ? -1 : 1);

                switch (this.cameraPosition) {
                    case "p1View": {
                        var newCameraPosition = ((direction == -1) ? "backView" : "frontView");
                        this.animator.setCameraChangeAnimation(this.cameraPosition, newCameraPosition, 800);
                        this.cameraPosition = newCameraPosition;
                        break;
                    }
                    case "p2View": {
                        var newCameraPosition = ((direction == -1) ? "frontView" : "backView");
                        this.animator.setCameraChangeAnimation(this.cameraPosition, newCameraPosition, 800);
                        this.cameraPosition = newCameraPosition;
                        break;
                    }
                    case "frontView": {
                        var allowedPlayer = ((direction == -1) ? "p1" : "p2");
                        var newCameraPosition = allowedPlayer + "View";

                        if (this.currentPlayer == allowedPlayer || (this.moveState == "computerPlaying" && this.getOpponentPlayer() == allowedPlayer) || this.gameInfo.gameMode == "ComputerVsComputer") {
                            this.animator.setCameraChangeAnimation(this.cameraPosition, newCameraPosition, 800);
                            this.cameraPosition = newCameraPosition;
                        }
                        break;
                    }
                    case "backView": {
                        var allowedPlayer = ((direction == -1) ? "p2" : "p1");
                        var newCameraPosition = allowedPlayer + "View";

                        if (this.currentPlayer == allowedPlayer || (this.moveState == "computerPlaying" && this.getOpponentPlayer() == allowedPlayer) || this.gameInfo.gameMode == "ComputerVsComputer") {
                            this.animator.setCameraChangeAnimation(this.cameraPosition, newCameraPosition, 800);
                            this.cameraPosition = newCameraPosition;
                        }
                        break;
                    }
                }
            }
        }
    }

    update(time) {
        this.animator.update(time);
        this.gui.update(time);

        this.currentPlayTime -= time;
        if (this.currentPlayTime <= 0 && (this.moveState == "pickPiece" || this.moveState == "pickTile")) {
            if (this.gameInfo.gameMode == "PlayerVsPlayer") {
                this.moveState = "changePlayer";
                var newCameraPosition = this.getOpponentPlayer() + "View"
                this.animator.setCameraChangeAnimation(this.cameraPosition, newCameraPosition, 1000);
                this.cameraPosition = newCameraPosition;
            }
            else {
                this.moveState = "pickPiece";
            }

            this.currentPlayTime = this.maxPlayTime;
            this.changePlayer();
            this.gui.errors["exceededTime"] = true;
        }

        if (this.moveState == "computerPlaying")
            this.currentPlayTime = this.maxPlayTime;

        if (
            ((this.gameInfo.gameMode == "PlayerVsComputer" && this.currentPlayer == "p2") ||
                (this.gameInfo.gameMode == "ComputerVsPlayer" && this.currentPlayer == "p1") ||
                (this.gameInfo.gameMode == "ComputerVsComputer"))
            && this.moveState != "inMoveAnimation"
            && this.moveState != "computerPlaying"
            && this.prolog.boardsInited
        ) {
            this.moveState = "computerPlaying";
            var difficultyLevel = ((this.currentPlayer == "p1") ? this.gameInfo.difficultyLevelP1 : this.gameInfo.difficultyLevelP2);
            this.prolog.getComputerMove(difficultyLevel, this.currentPlayer).then((gameMove) => {
                if (gameMove) {
                    this.tempGameMove = gameMove;
                    this.tempGameMove.playMove();
                    this.animator.setGameMoveAnimation(this.tempGameMove);

                    var newGameMove = new MyGameMove(this);
                    newGameMove.clone(this.tempGameMove);
                    this.gameOrchestrator.pushGameMove(newGameMove);
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
                angle = -Math.PI / 2.0;
                this.cameraPosition = "p1View";
                break;
            }
            case "ComputerVsPlayer": {
                angle = Math.PI / 2.0;
                this.cameraPosition = "p2View";
                break;
            }
            default: {
                this.cameraPosition = "frontView";
                break;
            }
        }

        this.scene.camera.orbit(CGFcameraAxis.Y, angle);
    }

    changePlayer() {
        this.currentPlayer = this.getOpponentPlayer();
    }

    getOpponentPlayer() {
        return ((this.currentPlayer == "p1") ? "p2" : "p1");
    }

    finishMove() {
        this.tempGameMove.finishMove();

        if (this.gameState != "gameOver") {
            if (this.gameInfo.gameMode == "PlayerVsPlayer") {
                this.moveState = "changePlayer";
                var newCameraPosition = this.getOpponentPlayer() + "View"
                this.animator.setCameraChangeAnimation(this.cameraPosition, newCameraPosition, 1000);
                this.cameraPosition = newCameraPosition;
            }
            else {
                this.moveState = "pickPiece";
                this.currentPlayTime = this.maxPlayTime;
            }

            this.changePlayer();
        }
        else {
            this.gameOrchestrator.gameState = new MyGameOverState(this.scene, this.gameOrchestrator);
        }
    }

    resetMove() {
        this.tempGameMove.resetMove();
        this.moveState = "pickPiece";
    }

    checkGameOver() {
        this.prolog.gameOver(this.tempGameMove).then((gameOver) => {
            if (gameOver) {
                this.gameState = "gameOver";
                if (this.cameraPosition != "frontView") {
                    this.animator.setCameraChangeAnimation(this.cameraPosition, "frontView", 1000);
                    this.cameraPosition = "frontView";
                }

                this.gameInfo.winner = this.currentPlayer;
                if (this.currentPlayer == "p1")
                    this.gameInfo.player1Score++;
                else
                    this.gameInfo.player2Score++;
            }
        });
    }

    display() {
        this.animator.animate();

        if (this.moveState == "changePlayer") {
            if (!this.animator.changingCamera) {
                this.moveState = "pickPiece";
                this.currentPlayTime = this.maxPlayTime;
            }
        }

        if (!this.animator.changingCamera)
            this.gui.display();
    }

}