class MyPlayState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameboards = gameOrchestrator.gameboards;

        this.currentPlayer = "p1";
        this.moveState = "pickPiece";

        this.animator = new MyAnimator(scene, this);
        this.prolog = new MyPrologInterface(this);

        this.setUpInitialCameraPosition();
        this.createOptionsSection();

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



        if (
            (   (this.gameInfo.gameMode == "PlayerVsComputer" && this.currentPlayer == "p2") ||
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

    createOptionsSection() {
        this.options = [];

        this.undoTexture = new CGFtexture(this.scene, "scenes/images/UI/undo.png");
        this.options["undo"] = new MyRectangle(this.scene, -5.0, 5.0, -5.0, 5.0);

        this.rotateCameraLeftTexture = new CGFtexture(this.scene, "scenes/images/UI/rotate_camera_left.png");
        this.options["rotateCameraLeft"] = new MyRectangle(this.scene, -5.0, 5.0, -5.0, 5.0);

        this.rotateCameraRightTexture = new CGFtexture(this.scene, "scenes/images/UI/rotate_camera_right.png");
        this.options["rotateCameraRight"] = new MyRectangle(this.scene, -5.0, 5.0, -5.0, 5.0);
    }

    displayOptionsSection() {

        var undoPos = [];
        var rotateLeftPos = [];
        var rotateRightPos = [];
        var rotationAngle = 0.0;

        switch (this.cameraPosition) {
            case "p1View": {
                undoPos = [-25.0, 40.0, 0.0];
                rotateLeftPos = [-25.0, 40.0, -12.5];
                rotateRightPos = [-25.0, 40.0, 12.5];
                rotationAngle = - Math.PI / 2;
                break;
            }
            case "p2View": {
                undoPos = [25.0, 40.0, 0.0];
                rotateLeftPos = [25.0, 40.0, 12.5];
                rotateRightPos = [25.0, 40.0, -12.5];
                rotationAngle = Math.PI / 2;
                break;
            }
            case "frontView": {
                undoPos = [0.0, 40.0, 25.0];
                rotateLeftPos = [-12.5, 40.0, 25.0];
                rotateRightPos = [12.5, 40.0, 25.0];
                rotationAngle = 0.0;
                break;
            }
            case "backView": {
                undoPos = [0.0, 40.0, -25.0];
                rotateLeftPos = [12.5, 40.0, -25.0];
                rotateRightPos = [-12.5, 40.0, -25.0];
                rotationAngle = Math.PI;
                break;
            }
        }

        this.scene.registerPicking();
        this.scene.clearPickRegistration();

        if (this.gameInfo.gameMode != "ComputerVsComputer") {
            this.scene.pushMatrix();
            this.undoTexture.bind(0);
            this.scene.registerForPick(50, '{"type":"option","option":"undo"}');
            this.scene.translate(undoPos[0], undoPos[1], undoPos[2]);
            this.scene.rotate(rotationAngle, 0.0, 1.0, 0.0);
            this.scene.rotate(-0.5, 1, 0, 0); 
            this.options["undo"].display();
            this.scene.clearPickRegistration();
            this.undoTexture.unbind(0);
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.rotateCameraLeftTexture.bind(0);
        this.scene.registerForPick(52, '{"type":"option","option":"rotateCamera","direction":"left"}');
        this.scene.translate(rotateLeftPos[0], rotateLeftPos[1], rotateLeftPos[2]);
        this.scene.rotate(rotationAngle, 0.0, 1.0, 0.0);
        this.scene.rotate(-0.5, 1, 0, 0); 
        this.options["rotateCameraLeft"].display();
        this.scene.clearPickRegistration();
        this.rotateCameraLeftTexture.unbind(0);
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.rotateCameraRightTexture.bind(0);
        this.scene.registerForPick(51, '{"type":"option","option":"rotateCamera","direction":"right"}');
        this.scene.translate(rotateRightPos[0], rotateRightPos[1], rotateRightPos[2]);
        this.scene.rotate(rotationAngle, 0.0, 1.0, 0.0);
        this.scene.rotate(-0.5, 1, 0, 0); 
        this.options["rotateCameraRight"].display();
        this.scene.clearPickRegistration();
        this.rotateCameraRightTexture.unbind(0);
        this.scene.popMatrix();
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
            }
        }

        this.displayOptionsSection();
    }


}