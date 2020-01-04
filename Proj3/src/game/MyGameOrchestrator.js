class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameInfo = {
            gameMode: "ComputerVsComputer",
            difficultyLevelP1: 3,
            difficultyLevelP2: 1,
            playTime: 10, 
            player1Score: 0,
            player2Score: 0,
            theme: "theme1"
        }

        this.gameSequence = new MyGameSequence();
        this.gameboards = new MyGameboards(scene);
        this.theme = new MySceneGraph(this.gameInfo.theme + ".xml", this);

        //this.gameState = new MyMenuState(scene, this);
        this.gameState = new MyPlayState(scene, this);
    }

    processPick(id, obj) {
        var pickInfo = JSON.parse(obj);
        this.gameState.processPick(id, pickInfo);
    }

    update(time) {
        this.gameState.update(time);
    }

    pushGameMove(gameMove) {
        this.gameSequence.pushGameMove(gameMove);
    }

    popPlayerGameMove(player) {
        return this.gameSequence.popPlayerGameMove(player);
    }

    getLastMoveBy(player) {
        return this.gameSequence.getLastMoveBy(player);
    }

    display() {
        if (this.theme.loadedOk) {
            this.gameboards.display();
            //this.theme.displayScene();
        }

        this.gameState.display();
    }



}