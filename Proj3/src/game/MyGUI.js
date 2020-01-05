class MyGUI {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;

        this.gameInfo = gameState.gameInfo;

        this.createOptionsSection();
        this.createErrorMessages();
        this.createTimeDisplayer();

    }

    createOptionsSection() {
        this.options = [];
        this.optionsTextures = [];
        this.optionsPos = [];
        this.UIrotationAngle = [];

        this.material = new CGFappearance(this.scene);
        this.material.setEmission(1, 1, 1, 1);

        this.options["undo"] = new MyRectangle(this.scene, -5.0, 5.0, -5.0, 5.0);
        this.optionsTextures["undo"] = new CGFtexture(this.scene, "scenes/images/UI/undo.png");

        this.options["rotateCameraLeft"] = new MyRectangle(this.scene, -5.0, 5.0, -5.0, 5.0);
        this.optionsTextures["rotateCameraLeft"] = new CGFtexture(this.scene, "scenes/images/UI/rotate_camera_left.png");

        this.options["rotateCameraRight"] = new MyRectangle(this.scene, -5.0, 5.0, -5.0, 5.0);
        this.optionsTextures["rotateCameraRight"] = new CGFtexture(this.scene, "scenes/images/UI/rotate_camera_right.png");
    }

    createErrorMessages() {
        this.errors = [];
        this.errorsTextures = [];

        this.errorRectangle = new MyRectangle(this.scene, -7.5, 7.5, -2.5, 2.5);
        this.errorPos = [];
        this.errorTime = 0.0;

        this.errors["invalidMove"] = false;
        this.errorsTextures["invalidMove"] = new CGFtexture(this.scene, "scenes/images/UI/invalid_move.png");

        this.errors["exceededTime"] = false;
        this.errorsTextures["exceededTime"] = new CGFtexture(this.scene, "scenes/images/UI/exceeded_time.png");
    }

    createTimeDisplayer() {
        var timeLeft = Math.floor(this.gameState.currentPlayTime / 1000);
        this.dozen = Math.floor(timeLeft / 10);
        this.unit = timeLeft % 10;

        if (this.dozen > 0) {
            this.dozenTexture = new CGFtexture(this.scene, "scenes/images/UI/nums/" + this.dozen + ".png");
        }

        this.unitTexture = new CGFtexture(this.scene, "scenes/images/UI/nums/" + this.unit + ".png");

        this.timeDisplayer = [];
        this.timeDisplayer["unit"] = new MyRectangle(this.scene, -2.5, 2.5, -2.5, 2.5);
        this.timeDisplayer["dozen"] = new MyRectangle(this.scene, -2.5, 2.5, -2.5, 2.5);
        this.unitPos = [];
        this.dozenPos = [];
    }

    update(time) {
        this.updateTimeDisplayer();
        this.updateErrorMessage(time);
    }

    updateTimeDisplayer() {
        var timeLeft = Math.floor(this.gameState.currentPlayTime / 1000);
        var dozen = Math.floor(timeLeft / 10);
        var unit = timeLeft % 10;

        if (dozen != this.dozen) {
            this.dozen = dozen;
            this.dozenTexture = new CGFtexture(this.scene, "scenes/images/UI/nums/" + this.dozen + ".png");
        }

        if (unit != this.unit) {
            this.unit = unit;
            this.unitTexture = new CGFtexture(this.scene, "scenes/images/UI/nums/" + this.unit + ".png");
        }
    }

    updateErrorMessage(time) {

    }

    calculateUIPos() {
        switch (this.gameState.cameraPosition) {
            case "p1View": {
                this.optionsPos["undo"] = [-25.0, 40.0, 0.0];
                this.optionsPos["rotateCameraLeft"] = [-25.0, 40.0, -12.5];
                this.optionsPos["rotateCameraRight"] = [-25.0, 40.0, 12.5];
                this.errorPos = [-30.0, 30.0, 30.0];
                this.dozenPos = [-25.0, 40.0, 30.0];
                this.unitPos = [-25.0, 40.0, 35.0];
                this.UIrotationAngle = - Math.PI / 2;
                break;
            }
            case "p2View": {
                this.optionsPos["undo"] = [25.0, 40.0, 0.0];
                this.optionsPos["rotateCameraLeft"] = [25.0, 40.0, 12.5];
                this.optionsPos["rotateCameraRight"] = [25.0, 40.0, -12.5];
                this.errorPos = [30.0, 30.0, -30.0];
                this.dozenPos = [25.0, 40.0, -25.0];
                this.unitPos = [25.0, 40.0, -30.5];
                this.UIrotationAngle = Math.PI / 2;
                break;
            }
            case "frontView": {
                this.optionsPos["undo"] = [0.0, 40.0, 25.0];
                this.optionsPos["rotateCameraLeft"] = [-12.5, 40.0, 25.0];
                this.optionsPos["rotateCameraRight"] = [12.5, 40.0, 25.0];
                this.errorPos = [30.0, 25.0, 30.0];
                this.dozenPos = [25.0, 40.0, 25.0];
                this.unitPos = [30.0, 40.0, 25.0];
                this.UIrotationAngle = 0.0;
                break;
            }
            case "backView": {
                this.optionsPos["undo"] = [0.0, 40.0, -25.0];
                this.optionsPos["rotateCameraLeft"] = [12.5, 40.0, -25.0];
                this.optionsPos["rotateCameraRight"] = [-12.5, 40.0, -25.0];
                this.errorPos = [30.0, 25.0, -30.0];
                this.dozenPos = [-25.0, 40.0, -25.0];
                this.unitPos = [-30.0, 40.0, -25.0];
                this.UIrotationAngle = Math.PI;
                break;
            }
        }
    }

    displayOptionsSection() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();

        if (this.gameInfo.gameMode != "ComputerVsComputer") {
            this.scene.registerForPick(50, '{"type":"option","option":"undo"}');
            this.scene.pushMatrix();
            this.optionsTextures["undo"].bind(0);
            this.scene.translate(this.optionsPos["undo"][0], this.optionsPos["undo"][1], this.optionsPos["undo"][2]);
            this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
            this.scene.rotate(-0.5, 1, 0, 0);
            this.options["undo"].display();
            this.scene.clearPickRegistration();
            this.optionsTextures["undo"].unbind(0);
            this.scene.popMatrix();
        }

        this.scene.registerForPick(52, '{"type":"option","option":"rotateCamera","direction":"left"}');
        this.scene.pushMatrix();
        this.optionsTextures["rotateCameraLeft"].bind(0);
        this.scene.translate(this.optionsPos["rotateCameraLeft"][0], this.optionsPos["rotateCameraLeft"][1], this.optionsPos["rotateCameraLeft"][2]);
        this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
        this.scene.rotate(-0.5, 1, 0, 0);
        this.options["rotateCameraLeft"].display();
        this.scene.clearPickRegistration();
        this.optionsTextures["rotateCameraLeft"].unbind(0);
        this.scene.popMatrix();

        this.scene.registerForPick(51, '{"type":"option","option":"rotateCamera","direction":"right"}');
        this.scene.pushMatrix();
        this.optionsTextures["rotateCameraRight"].bind(0);
        this.scene.translate(this.optionsPos["rotateCameraRight"][0], this.optionsPos["rotateCameraRight"][1], this.optionsPos["rotateCameraRight"][2]);
        this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
        this.scene.rotate(-0.5, 1, 0, 0);
        this.options["rotateCameraRight"].display();
        this.scene.clearPickRegistration();
        this.optionsTextures["rotateCameraRight"].unbind(0);
        this.scene.popMatrix();
    }

    displayError() {
        if (this.errors["invalidMove"]) {
            this.scene.pushMatrix();
            this.errorsTextures["invalidMove"].bind();
            this.scene.translate(this.errorPos[0], this.errorPos[1], this.errorPos[2]);
            this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
            this.scene.rotate(-0.5, 1, 0, 0);
            this.errorRectangle.display();
            this.errorsTextures["invalidMove"].unbind();
            this.scene.popMatrix();
        }
        else if (this.errors["exceededTime"]) {
            this.scene.pushMatrix();
            this.errorsTextures["exceededTime"].bind();
            this.scene.translate(this.errorPos[0], this.errorPos[1], this.errorPos[2]);
            this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
            this.scene.rotate(-0.5, 1, 0, 0);
            this.errorRectangle.display();
            this.errorsTextures["exceededTime"].unbind();
            this.scene.popMatrix();
        }
    }

    displayTimeLeft() {
        if (this.gameState.currentPlayTime > 0.0) {

            if (this.dozen > 0) {
                this.scene.pushMatrix();
                this.scene.translate(this.dozenPos[0], this.dozenPos[1], this.dozenPos[2]);
                this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
                this.scene.rotate(-0.5, 1, 0, 0);
                this.dozenTexture.bind(0);
                this.timeDisplayer["dozen"].display();
                this.dozenTexture.unbind(0);
                this.scene.popMatrix();
            }

            this.scene.pushMatrix();
            this.scene.translate(this.unitPos[0], this.unitPos[1], this.unitPos[2]);
            this.scene.rotate(this.UIrotationAngle, 0.0, 1.0, 0.0);
            this.scene.rotate(-0.5, 1, 0, 0);
            this.unitTexture.bind(0);
            this.timeDisplayer["unit"].display();
            this.unitTexture.unbind(0);
            this.scene.popMatrix();
        }
    }

    display() {
        this.material.apply();
        this.calculateUIPos();
        this.displayTimeLeft();
        this.displayOptionsSection();
        this.displayError();
    }

}