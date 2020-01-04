class MyGameOverState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.width = 30;
        this.height = 20;

        this.buttonWidth = this.width / 2.5;
        this.buttonHeight = this.height / 4.5;

        this.options = [];
        this.optionsPos = [];
        this.optionsTextures = [];

        this.showingGameMovie = false;
        this.currentMove = 0;
        this.gameSequence = this.gameOrchestrator.gameSequence;
        console.log(this.gameSequence.gameMoves);
        this.animator = new MyAnimator(scene, this);

        this.background = new MyRectangle(scene, -this.width/2.0, this.width/2.0, -this.height/2.0, this.height/2.0);

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
        this.options["mainMenu"] = new MyRectangle(this.scene, -this.buttonWidth/2.0, this.buttonWidth/2.0, -this.buttonHeight/2.0, this.buttonHeight/2.0);
        this.optionsPos["mainMenu"] = [0.0, this.height / 3.5];
        this.optionsTextures["mainMenu"] = new CGFtexture(this.scene, "scenes/images/main_menu_option.png");

        // Game Movie Option
        this.options["gameMovie"] = new MyRectangle(this.scene, -this.buttonWidth/2.0, this.buttonWidth/2.0, -this.buttonHeight/2.0, this.buttonHeight/2.0);
        this.optionsPos["gameMovie"] = [0.0, 0.0];
        this.optionsTextures["gameMovie"] = new CGFtexture(this.scene, "scenes/images/game_movie.png");

        // Play Again Option
        this.options["playAgain"] = new MyRectangle(this.scene, -this.buttonWidth/2.0, this.buttonWidth/2.0, -this.buttonHeight/2.0, this.buttonHeight/2.0);
        this.optionsPos["playAgain"] = [0.0, -this.height / 3.5];
        this.optionsTextures["playAgain"] = new CGFtexture(this.scene, "scenes/images/play_again.png");
    }

    display() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();

        this.scene.pushMatrix();

        if (this.showingGameMovie) {
            this.animator.animate();
            return;
        }


        // Background
        this.scene.translate(0, 35, 60);
        this.scene.rotate(-0.5, 1, 0, 0); 
        this.background.display();

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