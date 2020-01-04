class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameInfo = {
            gameMode: "PlayerVsPlayer",
            difficultyLevel: 1,
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

    popGameMove() {
        return this.gameSequence.popGameMove();
    }

    display() {
        if (this.theme.loadedOk) {
            this.gameboards.display();
            this.theme.displayScene();
        }

        this.gameState.display();
    }



}