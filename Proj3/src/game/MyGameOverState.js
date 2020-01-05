class MyGameOverState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.width = 30;
        this.height = 30;

        this.buttonWidth = this.width / 1.5;
        this.buttonHeight = this.height / 8;

        this.options = [];
        this.optionsPos = [];
        this.optionsTextures = [];

        this.showingGameMovie = false;
        this.currentMove = 0;
        this.gameSequence = this.gameOrchestrator.gameSequence;
        this.animator = new MyAnimator(scene, this);

        // background
        this.background = new MyRectangle(scene, -this.width / 2.0, this.width / 2.0, -this.height / 2.0, this.height / 2.0);
        this.backgroundTexture = new CGFtexture(scene, "scenes/images/UI/game_over.png");
        this.material = new CGFappearance(scene);
        this.material.setTexture(this.backgroundTexture);
        this.material.setEmission(1, 1, 1, 1);

        // winner banner
        this.winnerBanner = new MyRectangle(this.scene, -this.buttonWidth / 2.5, this.buttonWidth / 2.5, -this.buttonHeight / 5.0, this.buttonHeight / 5.0);
        this.winnerTexture = new CGFtexture(scene, "scenes/images/UI/winner_banner_" + this.gameInfo.winner + ".png");
        this.winnerBannerPos = [0.0, this.height / 2.0 - this.buttonHeight * 1.5];

        // Player 1 Score
        this.player1Score = new MyRectangle(this.scene, -this.width / 15.0, this.width / 15.0, -this.buttonHeight / 2.0, this.buttonHeight / 2.0);
        this.player1ScoreTexture = new CGFtexture(scene, "scenes/images/UI/nums/" + this.gameInfo.player1Score + ".png");
        this.player1ScorePos = [-this.width / 8.0, this.height / 7.0];

        // Player 2 Score
        this.player2Score = new MyRectangle(this.scene, -this.width / 15.0, this.width / 15.0, -this.buttonHeight / 2.0, this.buttonHeight / 2.0);
        this.player2ScoreTexture = new CGFtexture(scene, "scenes/images/UI/nums/" + this.gameInfo.player2Score + ".png");
        this.player2ScorePos = [this.width / 8.0, this.height / 7.0];

        this.createOptions();

        this.tempGameMove = new MyGameMove(this);
    }

    processPick(id, pickInfo) {

        if (pickInfo.type == "option") {
            this.gameOrchestrator.gameboards.resetBoards();

            switch (pickInfo.option) {
                case "mainMenu": {
                    this.gameOrchestrator.gameSequence.reset();
                    this.gameOrchestrator.gameState = new MyMenuState(this.scene, this.gameOrchestrator);
                    break;
                }
                case "gameMovie": {
                    this.currentMove = 0;
                    this.tempGameMove = this.gameSequence.getMove(this.currentMove);
                    this.tempGameMove.startMove();
                    this.animator.setGameMoveAnimation(this.tempGameMove);
                    this.showingGameMovie = true;
                    break;
                }
                case "playAgain": {
                    this.gameOrchestrator.gameSequence.reset();
                    this.gameOrchestrator.gameState = new MyPlayState(this.scene, this.gameOrchestrator);
                    break;
                }
            }
        }
    }

    update(time) {
        this.animator.update(time);
    }

    finishMove() {
        this.tempGameMove.finishMove();

        if (this.currentMove == this.gameSequence.gameMoves.length - 1) { // Game Film ended
            this.showingGameMovie = false;
            return;
        }

        this.currentMove++;
        this.tempGameMove = this.gameSequence.getMove(this.currentMove);
        this.tempGameMove.startMove();
        this.animator.setGameMoveAnimation(this.tempGameMove);
    }

    createOptions() {

        // Main Menu Option
        this.options["mainMenu"] = new MyRectangle(this.scene, -this.buttonWidth / 2.0, this.buttonWidth / 2.0, -this.buttonHeight / 2.0, this.buttonHeight / 2.0);
        this.optionsPos["mainMenu"] = [0.0, 0.0];
        this.optionsTextures["mainMenu"] = new CGFtexture(this.scene, "scenes/images/UI/main_menu_option.png");

        // Game Movie Option
        this.options["gameMovie"] = new MyRectangle(this.scene, -this.buttonWidth / 2.0, this.buttonWidth / 2.0, -this.buttonHeight / 2.0, this.buttonHeight / 2.0);
        this.optionsPos["gameMovie"] = [0.0, - this.buttonHeight * 1.2];
        this.optionsTextures["gameMovie"] = new CGFtexture(this.scene, "scenes/images/UI/game_movie.png");

        // Play Again Option
        this.options["playAgain"] = new MyRectangle(this.scene, -this.buttonWidth / 2.0, this.buttonWidth / 2.0, -this.buttonHeight / 2.0, this.buttonHeight / 2.0);
        this.optionsPos["playAgain"] = [0.0, -this.buttonHeight * 2.4];
        this.optionsTextures["playAgain"] = new CGFtexture(this.scene, "scenes/images/UI/play_again.png");
    }

    display() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();

        if (this.showingGameMovie) {
            this.animator.animate();
            return;
        }

        this.scene.pushMatrix();

        // Background
        this.scene.translate(0, 35, 60);
        this.scene.rotate(-0.5, 1, 0, 0);
        this.material.apply();
        this.background.display();

        // Winner Banner
        this.scene.pushMatrix();
        this.scene.translate(this.winnerBannerPos[0], this.winnerBannerPos[1], 1.0);
        this.winnerTexture.bind(0);
        this.winnerBanner.display();
        this.winnerTexture.unbind(0);
        this.scene.popMatrix();

        // Player 1 Score
        this.scene.pushMatrix();
        this.scene.translate(this.player1ScorePos[0], this.player1ScorePos[1], 1.0);
        this.player1ScoreTexture.bind(0);
        this.player1Score.display();
        this.player1ScoreTexture.unbind(0);
        this.scene.popMatrix();

        // Player 2 Score
        this.scene.pushMatrix();
        this.scene.translate(this.player2ScorePos[0], this.player2ScorePos[1], 1.0);
        this.player2ScoreTexture.bind(0);
        this.player2Score.display();
        this.player2ScoreTexture.unbind(0);
        this.scene.popMatrix();

        // Main Menu Option
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["mainMenu"][0], this.optionsPos["mainMenu"][1], 1.0);
        this.optionsTextures["mainMenu"].bind(0);
        this.scene.registerForPick(60, '{"type":"option","option":"mainMenu"}');
        this.options["mainMenu"].display();
        this.optionsTextures["mainMenu"].unbind(0);
        this.scene.popMatrix();

        // Game Movie Option
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["gameMovie"][0], this.optionsPos["gameMovie"][1], 1.0);
        this.optionsTextures["gameMovie"].bind(0);
        this.scene.registerForPick(61, '{"type":"option","option":"gameMovie"}');
        this.options["gameMovie"].display();
        this.optionsTextures["gameMovie"].unbind(0);
        this.scene.popMatrix();

        // Play Again Option
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["playAgain"][0], this.optionsPos["playAgain"][1], 1.0);
        this.optionsTextures["playAgain"].bind(0);
        this.scene.registerForPick(62, '{"type":"option","option":"playAgain"}');
        this.options["playAgain"].display();
        this.optionsTextures["playAgain"].unbind(0);
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.clearPickRegistration();
    }
}