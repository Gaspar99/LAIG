class MyMenuState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameInfo.player1Score = 0;
        this.gameInfo.player2Score = 0;
        this.theme = gameOrchestrator.theme;

        this.width = 50;
        this.height = 35;
        this.firstOptionsHeight = this.height/3.0;

        this.options = [];
        this.optionsPos = [];
        this.optionsTextures = [];
        this.background = new MyRectangle(scene, -this.width/2.0, this.width/2.0, -this.height/2.0, this.height/2.0);

        this.createOptions();
    }

    processPick(id, pickInfo) {
        if (pickInfo.type == "option") {

            switch (pickInfo.option) {
                case "PlayerVsPlayer": {
                    this.gameInfo.gameMode = "PlayerVsPlayer";
                    break;
                }
                case "PlayerVsComputer": {
                    this.gameInfo.gameMode = "PlayerVsComputer";
                    break;
                }
                case "ComputerVsComputer": {
                    this.gameInfo.gameMode = "ComputerVsComputer";
                    break;
                }
                case "Bot1Easy": {
                    this.gameInfo.difficultyLevelP1 = 1;
                    break;
                }
                case "Bot1Medium": {
                    this.gameInfo.difficultyLevelP1 = 2;
                    break;
                }
                case "Bot1Hard": {
                    this.gameInfo.difficultyLevelP1 = 3;
                    break;
                }
                case "Bot2Easy": {
                    this.gameInfo.difficultyLevelP2 = 1;
                    break;
                }
                case "Bot2Medium": {
                    this.gameInfo.difficultyLevelP2 = 2;
                    break;
                }
                case "Bot2Hard": {
                    this.gameInfo.difficultyLevelP2 = 3;
                    break;
                }
                case "StartGame": {
                    this.gameOrchestrator.gameState = new MyPlayState(this.scene, this.gameOrchestrator);
                    break;
                }
                case "5s": {
                    this.gameInfo.playTime = 5;
                    break;
                }
                case "10s": {
                    this.gameInfo.playTime = 10;
                    break;
                }
                case "15s": {
                    this.gameInfo.playTime = 15;
                    break;
                }
                case "Theme1": {
                    this.gameInfo.theme = "theme1";
                    break;
                }
                case "Theme2": {
                    this.gameInfo.theme = "theme2";
                    break;
                }
            }
        }
    }

    update(time) {

    }

    createOptions() {

        // Game Mode Options
        this.options["PlayerVsPlayer"] = new MyRectangle(this.scene, -this.width/8.0, this.width/8.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["PlayerVsPlayer"] = [-this.width / 4.0, this.firstOptionsHeight  / 3.0];

        this.options["PlayerVsComputer"] = new MyRectangle(this.scene, -this.width/8.0, this.width/8.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["PlayerVsComputer"] = [-this.width / 4.0, 0];

        this.options["ComputerVsComputer"] = new MyRectangle(this.scene, -this.width/8.0, this.width/8.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["ComputerVsComputer"] = [-this.width / 4.0, -this.firstOptionsHeight  / 3.0];

        // Computer 1 Dificulty
        this.options["Bot1Easy"] = new MyRectangle(this.scene, -this.width/10.0, this.width/10.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["Bot1Easy"] = [0.0, this.firstOptionsHeight  / 3.0];

        this.options["Bot1Medium"] = new MyRectangle(this.scene, -this.width/10.0, this.width/10.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["Bot1Medium"] = [0.0, 0.0];

        this.options["Bot1Hard"] = new MyRectangle(this.scene, -this.width/10.0, this.width/10.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["Bot1Hard"] = [0.0, -this.firstOptionsHeight  / 3.0];

        // Computer 2 Dificulty
        this.options["Bot2Easy"] = new MyRectangle(this.scene, -this.width/10.0, this.width/10.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["Bot2Easy"] = [0.0, this.firstOptionsHeight  / 3.0];

        this.options["Bot2Medium"] = new MyRectangle(this.scene, -this.width/10.0, this.width/10.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["Bot2Medium"] = [0.0, 0.0];

        this.options["Bot2Hard"] = new MyRectangle(this.scene, -this.width/10.0, this.width/10.0, -this.firstOptionsHeight /10.0, this.firstOptionsHeight /10.0);
        this.optionsPos["Bot2Hard"] = [0.0, -this.firstOptionsHeight  / 3.0];

        // Start Game
        this.options["StartGame"] = new MyRectangle(this.scene, -this.width/3.0, this.width/3.0, -this.height /10.0, this.height /10.0);
        this.optionsPos["StartGame"] = [0.0, -5.0];

        // Move Time
        this.options["5s"] = new MyRectangle(this.scene, -this.width/25.0, this.width/25.0, -this.height /30.0, this.height /30.0);
        this.optionsPos["5s"] = [-5.0, 0.0];

        this.options["10s"] = new MyRectangle(this.scene, -this.width/25.0, this.width/25.0, -this.height /30.0, this.height /30.0);
        this.optionsPos["10s"] = [0.0, 0.0];

        this.options["15s"] = new MyRectangle(this.scene, -this.width/25.0, this.width/25.0, -this.height /30.0, this.height /30.0);
        this.optionsPos["15s"] = [5.0, 0.0];

        // Theme
        this.options["Theme1"] = new MyRectangle(this.scene, -this.width/15.0, this.width/15.0, -this.height /30.0, this.height /30.0);
        this.optionsPos["Theme1"] = [-4.5, 0.0];

        this.options["Theme2"] = new MyRectangle(this.scene, -this.width/15.0, this.width/15.0, -this.height /30.0, this.height /30.0);
        this.optionsPos["Theme2"] = [4.5, 0.0];
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
        this.scene.translate(0, 35.5, 60);
        this.scene.rotate(-0.5, 1, 0, 0); 
        this.background.display();

        // Game Mode Options
        this.scene.pushMatrix();
        this.scene.translate(-2, 10, 0);

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["PlayerVsPlayer"][0], this.optionsPos["PlayerVsPlayer"][1], 1.0);
        if (this.gameInfo.gameMode == "PlayerVsPlayer")
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(63, '{"type":"option","option":"PlayerVsPlayer"}');
        this.options["PlayerVsPlayer"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["PlayerVsComputer"][0], this.optionsPos["PlayerVsComputer"][1], 1.0);
        if (this.gameInfo.gameMode == "PlayerVsComputer")
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(64, '{"type":"option","option":"PlayerVsComputer"}');
        this.options["PlayerVsComputer"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["ComputerVsComputer"][0], this.optionsPos["ComputerVsComputer"][1], 1.0);
        if (this.gameInfo.gameMode == "ComputerVsComputer")
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(65, '{"type":"option","option":"ComputerVsComputer"}');
        this.options["ComputerVsComputer"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Computer 1 Dificulty
        this.scene.pushMatrix();
        this.scene.translate(2.5, 10, 0);

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot1Easy"][0], this.optionsPos["Bot1Easy"][1], 1.0);
        if (this.gameInfo.difficultyLevelP1 == 1)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(66, '{"type":"option","option":"Bot1Easy"}');
        this.options["Bot1Easy"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot1Medium"][0], this.optionsPos["Bot1Medium"][1], 1.0);
        if (this.gameInfo.difficultyLevelP1 == 2)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(67, '{"type":"option","option":"Bot1Medium"}');
        this.options["Bot1Medium"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot1Hard"][0], this.optionsPos["Bot1Hard"][1], 1.0);
        if (this.gameInfo.difficultyLevelP1 == 3)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(68, '{"type":"option","option":"Bot1Hard"}');
        this.options["Bot1Hard"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Computer 2 Dificulty
        this.scene.pushMatrix();
        this.scene.translate(16, 10, 0);

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot2Easy"][0], this.optionsPos["Bot2Easy"][1], 1.0);
        if (this.gameInfo.difficultyLevelP2 == 1)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(69, '{"type":"option","option":"Bot2Easy"}');
        this.options["Bot2Easy"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot2Medium"][0], this.optionsPos["Bot2Medium"][1], 1.0);
        if (this.gameInfo.difficultyLevelP2 == 2)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(70, '{"type":"option","option":"Bot2Medium"}');
        this.options["Bot2Medium"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot2Hard"][0], this.optionsPos["Bot2Hard"][1], 1.0);
        if (this.gameInfo.difficultyLevelP2 == 3)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(71, '{"type":"option","option":"Bot2Hard"}');
        this.options["Bot2Hard"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Start Game
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["StartGame"][0], this.optionsPos["StartGame"][1], 1.0);
        this.scene.registerForPick(72, '{"type":"option","option":"StartGame"}');
        this.options["StartGame"].display();
        this.scene.popMatrix();

        // Move Time
        this.scene.pushMatrix();
        this.scene.translate(-15, -14, 0);

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["5s"][0], this.optionsPos["5s"][1], 1.0);
        if (this.gameInfo.playTime == 5)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(73, '{"type":"option","option":"5s"}');
        this.options["5s"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["10s"][0], this.optionsPos["10s"][1], 1.0);
        if (this.gameInfo.playTime == 10)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(74, '{"type":"option","option":"10s"}');
        this.options["10s"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["15s"][0], this.optionsPos["15s"][1], 1.0);
        if (this.gameInfo.playTime == 15)
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(75, '{"type":"option","option":"15s"}');
        this.options["15s"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Theme
        this.scene.pushMatrix();
        this.scene.translate(14.5, -14, 0);

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Theme1"][0], this.optionsPos["Theme1"][1], 1.0);
        if (this.gameInfo.theme == "theme1")
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(76, '{"type":"option","option":"Theme1"}');
        this.options["Theme1"].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Theme2"][0], this.optionsPos["Theme2"][1], 1.0);
        if (this.gameInfo.theme == "theme2")
            this.scene.scale(1.1, 1.1, 1);
        this.scene.registerForPick(77, '{"type":"option","option":"Theme2"}');
        this.options["Theme2"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}