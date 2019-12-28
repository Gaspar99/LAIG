class MyAnimator {
    constructor(scene, gameOrchestrator) {
        this.scene = scene;

        this.gameOrchestrator = gameOrchestrator;

        this.animations = [];

        this.animatedPiece = [];
        this.deselectedPiece = [];

        // Camera
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
        var angle = Math.PI * (time / this.cameraChangeDuration);
        this.orbitedAngle += angle;

        if (this.orbitedAngle >= Math.PI) {
            angle = Math.PI - this.lastAngle;

            this.changingCamera = false;
            this.orbitedAngle = 0.0;
        }

        this.scene.camera.orbit(CGFcameraAxis.Y, angle);
        this.lastAngle = this.orbitedAngle;
    }

    setPickingAnimation(piece) {
        this.animatedPiece = piece;

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

        //Key frame 1
        var instant1 = 0.0;
        var transCoords1 = [0.0, 0.0, 0.0];
        var rotateCoords1 = [0.0, 0.0, 0.0];
        var scaleCoords1 = [1.2, 0.7, 1.2];

        var keyframe1 = new MyKeyFrame(instant1, transCoords1, rotateCoords1, scaleCoords1);

        //Key frame 2
        var instant2 = 0.3;
        var transCoords2 = [0.0, 0.0, 0.0];
        var rotateCoords2 = [0.0, 0.0, 0.0];
        var scaleCoords2 = [1.0, 1.0, 1.0];

        var keyframe2 = new MyKeyFrame(instant2, transCoords2, rotateCoords2, scaleCoords2);

        this.animations["deselect"] = new MyKeyFrameAnimation(this.scene, [keyframe1, keyframe2]);
    }

    setGameMoveAnimation(gameMove) {
        var piece = gameMove.piece;

        var board = [];
        if (piece.player == "p1")
            board = this.gameOrchestrator.gameboards.player1PiecesBoard;
        else
            board = this.gameOrchestrator.gameboards.player2PiecesBoard;

        piece.xPos += board.xPos;

        var finalXCoord = (gameMove.destinationTile.xPos - piece.xPos) / (piece.size);
        var finalZCoord = (gameMove.destinationTile.zPos - piece.zPos) / (piece.size);

        var keyframes = [];

        //Key frame 1
        var instant1 = 0.2;
        var transCoords1 = [0.0, 0.5, 0.0];
        var rotateCoords1 = [0.0, 0.0, 0.0];
        var scaleCoords1 = [0.85, 1.15, 0.85];

        keyframes.push(new MyKeyFrame(instant1, transCoords1, rotateCoords1, scaleCoords1));

        //Key frame 2
        var instant2 = 0.4;
        var transCoords2 = [finalXCoord / 5.0, 2.0, finalZCoord / 5.0];
        var rotateCoords2 = [0.0, 0.0, 0.0];
        var scaleCoords2 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant2, transCoords2, rotateCoords2, scaleCoords2));

        //Key frame 3
        var instant3 = 0.6;
        var transCoords3 = [finalXCoord / 2.0, 2.5, finalZCoord / 2.0];
        var rotateCoords3 = [0.0, 0.0, 0.0];
        var scaleCoords3 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant3, transCoords3, rotateCoords3, scaleCoords3));

        //Key frame 4
        var instant4 = 0.8;
        var transCoords4 = [(4 * finalXCoord) / 5.0, 2.0, (4 * finalZCoord) / 5.0];
        var rotateCoords4 = [0.0, 0.0, 0.0];
        var scaleCoords4 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant4, transCoords4, rotateCoords4, scaleCoords4));

        //Key frame 5
        var instant5 = 1.0;
        var transCoords5 = [finalXCoord, 0.0, finalZCoord];
        var rotateCoords5 = [0.0, 0.0, 0.0];
        var scaleCoords5 = [1.0, 1.0, 1.0];

        keyframes.push(new MyKeyFrame(instant5, transCoords5, rotateCoords5, scaleCoords5));

        this.animations["movePiece"] = new MyKeyFrameAnimation(this.scene, keyframes);
    }

    setCameraChangeAnimation() {
        this.changingCamera = true;
        this.cameraChangeDuration = 1000 // milliseconds
    }

    animateSelectedPiece() {
        if (this.animations["picking"].finished) {
            return false;
        }
        else {
            var ma = this.animations["picking"].apply();
            this.animatedPiece.setAnimationMatrix(ma);
            return true;
        }
    }

    animateDeselectedPiece() {
        if (this.animations["deselect"].finished) {
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
            return false;
        }
        else {
            return true;
        }
    }


}