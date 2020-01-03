class MyMenuState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameInfo = gameOrchestrator.gameInfo;
        this.theme = gameOrchestrator.theme;

        this.background = new MyRectangle(scene, -10, 10, -10, 10);
    }

    processPick(id, pickInfo) {

    }

    update(time) {

    }

    display() {

    }
}