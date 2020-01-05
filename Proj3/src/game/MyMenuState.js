class MyMenuState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameInfo.player1Score = 0;
        this.gameInfo.player2Score = 0;
        this.theme = gameOrchestrator.theme;

        this.width = 50;
        this.height = 35;

        this.buttonWidth = this.width / 15.0;

        this.gameModeHeight = 8.0;
        this.gameMoveButtonWidth = this.width / 5.0;
        this.gameMoveButtonHeight = this.height / 15.0;

        this.pcDifficultyHeight = 3.0;
        this.pcDifficultyButtonWidth = this.width / 12.0
        this.pcDifficultyButtonHeight = this.height / 20.0

        this.maxPlayTimeHeight = -2.0;
        this.maxPlayTimeButtonWidth = this.width / 20.0;
        this.maxPlayTimeButtonHeight = this.height / 20.0;

        this.themeHeight = -7.0;
        this.themeButtonWidth = this.width / 10.0;
        this.themeButtonHeight = this.height / 15.0;

        this.options = [];
        this.optionsPos = [];
        this.optionsTextures = [];
        this.background = new MyRectangle(scene, -this.width/2.0, this.width/2.0, -this.height/2.0, this.height/2.0);
        this.backgroundTexture = new CGFtexture(scene, "scenes/images/UI/menu.png");
        this.material = new CGFappearance(scene);
        this.material.setTexture(this.backgroundTexture);
        this.material.setEmission(1, 1, 1, 1);

        this.createOptions();
    }

    processPick(id, pickInfo) {
        if (pickInfo.type == "option") {

            switch (pickInfo.option) {
                case "startGame": {
                    this.gameOrchestrator.gameState = new MyPlayState(this.scene, this.gameOrchestrator);
                    break;
                }
                case "gameMode": {
                    this.gameInfo.gameMode = pickInfo.value;
                    break;
                }
                case "difficulty": {
                    if (pickInfo.pc == 1)
                        this.gameInfo.difficultyLevelP1 = pickInfo.level;
                    else
                        this.gameInfo.difficultyLevelP2 = pickInfo.level;
                    break;
                }
                case "playTime": {
                    this.gameInfo.playTime = pickInfo.value;
                    break;
                }
                case "theme": {
                    this.gameInfo.theme = pickInfo.value;
                    this.gameOrchestrator.theme = new MySceneGraph(this.gameInfo.theme + ".xml", this.gameOrchestrator);
                    break;
                }
            }
        }
    }

    createOptions() {

        // Game Mode Options
        this.options["PlayerVsPlayer"] = new MyRectangle(this.scene, -this.gameMoveButtonWidth/2.0, this.gameMoveButtonWidth/2.0, -this.gameMoveButtonHeight/2.0, this.gameMoveButtonHeight/2.0);
        this.optionsPos["PlayerVsPlayer"] = -this.width / 3.0;
        this.optionsTextures["PlayerVsPlayer"] = new CGFtexture(this.scene, "scenes/images/UI/player_vs_player.png");

        this.options["PlayerVsComputer"] = new MyRectangle(this.scene, -this.gameMoveButtonWidth/2.0, this.gameMoveButtonWidth/2.0, -this.gameMoveButtonHeight/2.0, this.gameMoveButtonHeight/2.0);
        this.optionsPos["PlayerVsComputer"] = -this.width / 10.0;
        this.optionsTextures["PlayerVsComputer"] = new CGFtexture(this.scene, "scenes/images/UI/player_vs_pc.png");

        this.options["ComputerVsPlayer"] = new MyRectangle(this.scene, -this.gameMoveButtonWidth/2.0, this.gameMoveButtonWidth/2.0, -this.gameMoveButtonHeight/2.0, this.gameMoveButtonHeight/2.0);
        this.optionsPos["ComputerVsPlayer"] = this.width / 10.0;
        this.optionsTextures["ComputerVsPlayer"] = new CGFtexture(this.scene, "scenes/images/UI/pc_vs_player.png");

        this.options["ComputerVsComputer"] = new MyRectangle(this.scene, -this.gameMoveButtonWidth/2.0, this.gameMoveButtonWidth/2.0, -this.gameMoveButtonHeight/2.0, this.gameMoveButtonHeight/2.0);
        this.optionsPos["ComputerVsComputer"] = this.width / 3.0;
        this.optionsTextures["ComputerVsComputer"] = new CGFtexture(this.scene, "scenes/images/UI/pc_vs_pc.png");

        // Computer 1 Dificulty
        this.options["Bot1Easy"] = new MyRectangle(this.scene, -this.pcDifficultyButtonWidth/2.0, this.pcDifficultyButtonWidth/2.0, -this.pcDifficultyButtonHeight/2.0, this.pcDifficultyButtonHeight/2.0);
        this.optionsPos["Bot1Easy"] = - 7.5 * this.width / 20.0;
        this.optionsTextures["Bot1Easy"] = new CGFtexture(this.scene, "scenes/images/UI/easy.png");

        this.options["Bot1Medium"] = new MyRectangle(this.scene, -this.pcDifficultyButtonWidth/2.0, this.pcDifficultyButtonWidth/2.0, -this.pcDifficultyButtonHeight/2.0, this.pcDifficultyButtonHeight/2.0);
        this.optionsPos["Bot1Medium"] = - 5 * this.width / 20.0;
        this.optionsTextures["Bot1Medium"] = new CGFtexture(this.scene, "scenes/images/UI/medium.png");

        this.options["Bot1Hard"] = new MyRectangle(this.scene, -this.pcDifficultyButtonWidth/2.0, this.pcDifficultyButtonWidth/2.0, -this.pcDifficultyButtonHeight/2.0, this.pcDifficultyButtonHeight/2.0);
        this.optionsPos["Bot1Hard"] = - 2.5 * this.width / 20.0;
        this.optionsTextures["Bot1Hard"] = new CGFtexture(this.scene, "scenes/images/UI/hard.png");

        // Computer 2 Dificulty
        this.options["Bot2Easy"] = new MyRectangle(this.scene, -this.pcDifficultyButtonWidth/2.0, this.pcDifficultyButtonWidth/2.0, -this.pcDifficultyButtonHeight/2.0, this.pcDifficultyButtonHeight/2.0);
        this.optionsPos["Bot2Easy"] = 2.5 * this.width / 20.0;
        this.optionsTextures["Bot2Easy"] = new CGFtexture(this.scene, "scenes/images/UI/easy.png");

        this.options["Bot2Medium"] = new MyRectangle(this.scene, -this.pcDifficultyButtonWidth/2.0, this.pcDifficultyButtonWidth/2.0, -this.pcDifficultyButtonHeight/2.0, this.pcDifficultyButtonHeight/2.0);
        this.optionsPos["Bot2Medium"] = 5 * this.width / 20.0;
        this.optionsTextures["Bot2Medium"] = new CGFtexture(this.scene, "scenes/images/UI/medium.png");

        this.options["Bot2Hard"] = new MyRectangle(this.scene, -this.pcDifficultyButtonWidth/2.0, this.pcDifficultyButtonWidth/2.0, -this.pcDifficultyButtonHeight/2.0, this.pcDifficultyButtonHeight/2.0);
        this.optionsPos["Bot2Hard"] = 7.5 * this.width / 20.0;
        this.optionsTextures["Bot2Hard"] = new CGFtexture(this.scene, "scenes/images/UI/hard.png");

        // Max Play Time
        this.options["5s"] = new MyRectangle(this.scene, -this.maxPlayTimeButtonWidth/2.0, this.maxPlayTimeButtonWidth/2.0, -this.maxPlayTimeButtonHeight/2.0, this.maxPlayTimeButtonHeight/2.0);
        this.optionsPos["5s"] = -6.0;
        this.optionsTextures["5s"] = new CGFtexture(this.scene, "scenes/images/UI/5s.png");

        this.options["10s"] = new MyRectangle(this.scene, -this.maxPlayTimeButtonWidth/2.0, this.maxPlayTimeButtonWidth/2.0, -this.maxPlayTimeButtonHeight/2.0, this.maxPlayTimeButtonHeight/2.0);
        this.optionsPos["10s"] = -2;
        this.optionsTextures["10s"] = new CGFtexture(this.scene, "scenes/images/UI/10s.png");

        this.options["15s"] = new MyRectangle(this.scene, -this.maxPlayTimeButtonWidth/2.0, this.maxPlayTimeButtonWidth/2.0, -this.maxPlayTimeButtonHeight/2.0, this.maxPlayTimeButtonHeight/2.0);
        this.optionsPos["15s"] = 2;
        this.optionsTextures["15s"] = new CGFtexture(this.scene, "scenes/images/UI/15s.png");

        this.options["20s"] = new MyRectangle(this.scene, -this.maxPlayTimeButtonWidth/2.0, this.maxPlayTimeButtonWidth/2.0, -this.maxPlayTimeButtonHeight/2.0, this.maxPlayTimeButtonHeight/2.0);
        this.optionsPos["20s"] = 6.0;
        this.optionsTextures["20s"] = new CGFtexture(this.scene, "scenes/images/UI/20s.png");

        // Theme
        this.options["theme1"] = new MyRectangle(this.scene, -this.themeButtonWidth/2.0, this.themeButtonWidth/2.0, -this.themeButtonHeight/2.0, this.themeButtonHeight/2.0);
        this.optionsPos["theme1"] = -5.0;
        this.optionsTextures["theme1"] = new CGFtexture(this.scene, "scenes/images/UI/theme1.png");

        this.options["theme2"] = new MyRectangle(this.scene, -this.themeButtonWidth/2.0, this.themeButtonWidth/2.0, -this.themeButtonHeight/2.0, this.themeButtonHeight/2.0);
        this.optionsPos["theme2"] = 3.0;
        this.optionsTextures["theme2"] = new CGFtexture(this.scene, "scenes/images/UI/theme2.png");

        // Start Game
        this.options["startGame"] = new MyRectangle(this.scene, -this.width/5.0, this.width/5.0, -this.height /20.0, this.height /20.0);
        this.optionsTextures["startGame"] = new CGFtexture(this.scene, "scenes/images/UI/start_game.png");
    }

    display() {
        var id = 60;

        this.scene.registerPicking();
        this.scene.clearPickRegistration();

        this.scene.pushMatrix();

        // Background
        this.scene.translate(0, 35.5, 60);
        this.scene.rotate(-0.5, 1, 0, 0); 
        this.material.apply();
        this.background.display();

        // Game Mode Options
        this.scene.pushMatrix();
        this.scene.translate(0.0, this.gameModeHeight, 0.0);

        this.scene.registerForPick(id++, '{"type":"option","option":"gameMode","value":"PlayerVsPlayer"}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["PlayerVsPlayer"], 0.0, 1.0);
        if (this.gameInfo.gameMode == "PlayerVsPlayer") this.scene.scale(1.2, 1.2, 1.0);
        this.optionsTextures["PlayerVsPlayer"].bind();
        this.options["PlayerVsPlayer"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"gameMode","value":"PlayerVsComputer"}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["PlayerVsComputer"], 0.0, 1.0);
        if (this.gameInfo.gameMode == "PlayerVsComputer") this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["PlayerVsComputer"].bind();
        this.options["PlayerVsComputer"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"gameMode","value":"ComputerVsPlayer"}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["ComputerVsPlayer"], 0.0, 1.0);
        if (this.gameInfo.gameMode == "ComputerVsPlayer") this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["ComputerVsPlayer"].bind();
        this.options["ComputerVsPlayer"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"gameMode","value":"ComputerVsComputer"}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["ComputerVsComputer"], 0.0, 1.0);
        if (this.gameInfo.gameMode == "ComputerVsComputer") this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["ComputerVsComputer"].bind();
        this.options["ComputerVsComputer"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Computer 1 Dificulty
        this.scene.pushMatrix();
        this.scene.translate(0.0, this.pcDifficultyHeight, 0.0);

        this.scene.registerForPick(id++, '{"type":"option","option":"difficulty","pc":1,"level":1}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot1Easy"], 0.0, 1.0);
        if (this.gameInfo.difficultyLevelP1 == 1) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["Bot1Easy"].bind();
        this.options["Bot1Easy"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"difficulty","pc":1,"level":2}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot1Medium"], 0.0, 1.0);
        if (this.gameInfo.difficultyLevelP1 == 2) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["Bot1Medium"].bind();
        this.options["Bot1Medium"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"difficulty","pc":1,"level":3}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot1Hard"], 0.0, 1.0);
        if (this.gameInfo.difficultyLevelP1 == 3) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["Bot1Hard"].bind();
        this.options["Bot1Hard"].display();
        this.scene.popMatrix();

        // Computer 2 Dificulty
        this.scene.registerForPick(id++, '{"type":"option","option":"difficulty","pc":2,"level":1}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot2Easy"], 0.0, 1.0);
        if (this.gameInfo.difficultyLevelP2 == 1) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["Bot2Easy"].bind();
        this.options["Bot2Easy"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"difficulty","pc":2,"level":2}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot2Medium"], 0.0, 1.0);
        if (this.gameInfo.difficultyLevelP2 == 2) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["Bot2Medium"].bind();
        this.options["Bot2Medium"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"difficulty","pc":2,"level":3}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["Bot2Hard"], 0.0, 1.0);
        if (this.gameInfo.difficultyLevelP2 == 3) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["Bot2Hard"].bind();
        this.options["Bot2Hard"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Max Play Time
        this.scene.pushMatrix();
        this.scene.translate(0.0, this.maxPlayTimeHeight, 0.0);

        this.scene.registerForPick(id++, '{"type":"option","option":"playTime","value":5}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["5s"], 0.0, 1.0);
        if (this.gameInfo.playTime == 5) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["5s"].bind();
        this.options["5s"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"playTime","value":10}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["10s"], 0.0, 1.0);
        if (this.gameInfo.playTime == 10) this.scene.scale(1.1, 1.1, 1);
        this.optionsTextures["10s"].bind();
        this.options["10s"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"playTime","value":15}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["15s"], 0.0, 1.0);
        if (this.gameInfo.playTime == 15) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["15s"].bind();
        this.options["15s"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"playTime","value":20}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["20s"], 0.0, 1.0);
        if (this.gameInfo.playTime == 20) this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["20s"].bind();
        this.options["20s"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        // Theme
        this.scene.pushMatrix();
        this.scene.translate(0.0, this.themeHeight, 0.0);

        this.scene.registerForPick(id++, '{"type":"option","option":"theme","value":"theme1"}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["theme1"], 0.0, 1.0);
        if (this.gameInfo.theme == "theme1") this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["theme1"].bind();
        this.options["theme1"].display();
        this.scene.popMatrix();

        this.scene.registerForPick(id++, '{"type":"option","option":"theme","value":"theme2"}');
        this.scene.pushMatrix();
        this.scene.translate(this.optionsPos["theme2"], 0.0, 1.0);
        if (this.gameInfo.theme == "theme2") this.scene.scale(1.2, 1.2, 1);
        this.optionsTextures["theme2"].bind();
        this.options["theme2"].display();
        this.scene.popMatrix(); 

        this.scene.popMatrix();
        
        // Start Game
        this.scene.registerForPick(id++, '{"type":"option","option":"startGame"}');
        this.scene.pushMatrix();
        this.scene.translate(0.0, -11.0, 5.0);
        this.optionsTextures["startGame"].bind();
        this.options["startGame"].display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}