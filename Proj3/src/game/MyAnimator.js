class MyAnimator {
    constructor(scene, playState) {
        this.scene = scene;

        this.playState = playState;

        this.animations = [];

        this.animatedPiece = [];
        this.selectedPiece = [];
        this.deselectedPiece = [];

        // Camera
        this.rotationAngle = Math.PI;
        this.changingCamera = false;
        this.orbitedAngle = 0.0;
        this.lastAngle = 0.0;

        this.gameSequence = [];
    }

    update(time) {
        for (var key in this.animations) {
            if (this.animations.hasOwnProperty(key)) {
                this.animations[key].update(time);
            }
        }

        if (this.changingCamera)
            this.updateCameraPosition(time);
    }

    updateCameraPosition(time) {
        var angle = this.rotationAngle * (time / this.cameraChangeDuration);
        this.orbitedAngle += angle;

        if (this.orbitedAngle >= this.rotationAngle) {
            angle = this.rotationAngle - this.lastAngle;

            this.changingCamera = false;
            this.orbitedAngle = 0.0;
        }

        this.scene.camera.orbit(CGFcameraAxis.Y, angle);
        this.lastAngle = this.orbitedAngle;
    }

    setPickingAnimation(piece) {
        this.selectedPiece = piece;

        //Key frame 1
        var instant = 0.3;
        var transCoords = [0.0, 0.0, 0.0];
        var rotateCoords = [0.0, 0.0, 0.0];
        var scaleCoords = [1.2, 0.7, 1.2];

        var keyframe1 = new MyKeyFrame(instant, transCoords, rotateCoords, scaleCoords);

        this.animations["picking"] = new MyKeyFrameAnimation(this.scene, [keyframe1]);
    }

    setDeselectAnimation(piece) {
        this.deselectedPiece = piece;

        var keyframes = [];

        //Key frame 1
        var instant1 = 0.0;
        var transCoords1 = [0.0, 0.0, 0.0];
        var rotateCoords1 = [0.0, 0.0, 0.0];
        var scaleCoords1 = [1.2, 0.7, 1.2];

        keyframes.push(new MyKeyFrame(instant1, transCoords1, rotateCoords1, scaleCoords1));

        //Key frame 2
        var instant2 = 0.3;
        var transCoords2 = [0.0, 0.0, 0.0];
        var rotateCoords2 = [0.0, 0.0, 0.0];
        var scaleCoords2 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant2, transCoords2, rotateCoords2, scaleCoords2));

        this.animations["deselect"] = new MyKeyFrameAnimation(this.scene, keyframes);
    }

    setGameMoveAnimation(gameMove) {
        var piece = gameMove.piece;
        this.animatedPiece = piece;

        var board = [];
        if (piece.player == "p1")
            board = this.playState.gameboards.player1PiecesBoard;
        else
            board = this.playState.gameboards.player2PiecesBoard;

        piece.xPos += board.xPos;

        var xMovement = (gameMove.destinationTile.xPos - piece.xPos) / piece.size;
        var zMovement = (gameMove.destinationTile.zPos - piece.zPos) / piece.size;

        var keyframes = [];

        //Key frame 1
        var instant1 = 0.4;
        var transCoords1 = [0.0, 0.5, 0.0];
        var rotateCoords1 = [0.0, 0.0, 0.0];
        var scaleCoords1 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant1, transCoords1, rotateCoords1, scaleCoords1));

        //Key frame 2
        var instant2 = 0.65;
        var transCoords2 = [xMovement / 5.0, 1.0, zMovement / 5.0];
        var rotateCoords2 = [0.0, 0.0, 0.0];
        var scaleCoords2 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant2, transCoords2, rotateCoords2, scaleCoords2));

        //Key frame 3
        var instant3 = 0.79;
        var transCoords3 = [xMovement / 2.0, 2.5, zMovement / 2.0];
        var rotateCoords3 = [0.0, 0.0, 0.0];
        var scaleCoords3 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant3, transCoords3, rotateCoords3, scaleCoords3));

        //Key frame 4
        var instant4 = 0.92;
        var transCoords4 = [(4 * xMovement) / 5.0, 2.0, (4 * zMovement) / 5.0];
        var rotateCoords4 = [0.0, 0.0, 0.0];
        var scaleCoords4 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant4, transCoords4, rotateCoords4, scaleCoords4));

        //Key frame 5
        var instant5 = 1.16;
        var transCoords5 = [xMovement, 0.0, zMovement];
        var rotateCoords5 = [0.0, 0.0, 0.0];
        var scaleCoords5 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant5, transCoords5, rotateCoords5, scaleCoords5));

        this.animations["movePiece"] = new MyKeyFrameAnimation(this.scene, keyframes);
    }

    setReverseGameMoveAnimation(gameMove) {
        var piece = gameMove.piece;
        this.reverseMovePiece = piece;

        var board = [];
        if (piece.player == "p1")
            board = this.playState.gameboards.player1PiecesBoard;
        else
            board = this.playState.gameboards.player2PiecesBoard;

        var finalXCoord = gameMove.originTile.xPos + board.xPos;
        var finalZCoord = gameMove.originTile.zPos + board.zPos;

        var xMovement = (finalXCoord - piece.xPos) / piece.size;
        var zMovement = (finalZCoord - piece.zPos) / piece.size;

        var keyframes = [];

        //Key frame 1
        var instant1 = 0.4;
        var transCoords1 = [0.0, 0.5, 0.0];
        var rotateCoords1 = [0.0, 0.0, 0.0];
        var scaleCoords1 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant1, transCoords1, rotateCoords1, scaleCoords1));

        //Key frame 2
        var instant2 = 0.65;
        var transCoords2 = [xMovement / 5.0, 1.0, zMovement / 5.0];
        var rotateCoords2 = [0.0, 0.0, 0.0];
        var scaleCoords2 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant2, transCoords2, rotateCoords2, scaleCoords2));

        //Key frame 3
        var instant3 = 0.79;
        var transCoords3 = [xMovement / 2.0, 2.5, zMovement / 2.0];
        var rotateCoords3 = [0.0, 0.0, 0.0];
        var scaleCoords3 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant3, transCoords3, rotateCoords3, scaleCoords3));

        //Key frame 4
        var instant4 = 0.92;
        var transCoords4 = [(4 * xMovement) / 5.0, 2.0, (4 * zMovement) / 5.0];
        var rotateCoords4 = [0.0, 0.0, 0.0];
        var scaleCoords4 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant4, transCoords4, rotateCoords4, scaleCoords4));

        //Key frame 5
        var instant5 = 1.16;
        var transCoords5 = [xMovement, 0.0, zMovement];
        var rotateCoords5 = [0.0, 0.0, 0.0];
        var scaleCoords5 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant5, transCoords5, rotateCoords5, scaleCoords5));

        this.animations["reverseMove"] = new MyKeyFrameAnimation(this.scene, keyframes);

    }

    setCameraChangeAnimation(angle, duration) {
        this.rotationAngle = angle;
        this.changingCamera = true;
        this.cameraChangeDuration = duration // milliseconds
    }

    animateSelectedPiece() {
        if (this.animations["picking"].finished) {
            this.selectedPiece = [];
            return false;
        }
        else {
            var ma = this.animations["picking"].apply();
            this.selectedPiece.setAnimationMatrix(ma);
            return true;
        }
    }

    animateDeselectedPiece() {
        if (this.animations["deselect"].finished) {
            this.deselectedPiece = [];
            return false;
        }
        else {
            var ma = this.animations["deselect"].apply();
            if (JSON.stringify(ma) != JSON.stringify(mat4.create())) {
                this.deselectedPiece.setAnimationMatrix(ma);
            }
            return true;
        }
    }

    animateMove() {
        var ma = this.animations["movePiece"].apply();
        this.animatedPiece.setAnimationMatrix(ma);
        this.animatedPiece.display();

        if (this.animations["movePiece"].finished) {
            this.animatedPiece.setAnimationMatrix(mat4.create());
            this.animatedPiece = [];
            return false;
        }
        else {
            return true;
        }
    }

    animateReverseMovePiece() {
        var ma = this.animations["reverseMove"].apply();
        this.reverseMovePiece.setAnimationMatrix(ma);
        this.reverseMovePiece.display();

        if (this.animations["reverseMove"].finished) {
            this.reverseMovePiece.setAnimationMatrix(mat4.create());
            this.reverseMovePiece = [];
            return false;
        }
        else {
            return true;
        }
    }

    animate() {

        if (this.animations.hasOwnProperty("picking")) {
            if (!this.animateSelectedPiece()) {
                delete this.animations["picking"];
            }
        }

        if (this.animations.hasOwnProperty("deselect")) {
            if (!this.animateDeselectedPiece()) {
                delete this.animations["deselect"];
            }
        }

        if (this.animations.hasOwnProperty("movePiece")) {
            if (!this.animateMove()) {
                delete this.animations["movePiece"];
                this.playState.finishMove();
            }
        }

        if (this.animations.hasOwnProperty("reverseMove")) {
            if (!this.animateReverseMovePiece()) {
                delete this.animations["reverseMove"];
                this.playState.resetMove();
            }
        }
    }


}