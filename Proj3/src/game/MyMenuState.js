class MyMenuState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameInfo = gameOrchestrator.gameInfo;
        this.theme = gameOrchestrator.theme;

        this.background = new MyRectangle(scene, -20, 20, -13, 13);
    }

    processPick(id, pickInfo) {

    }

    update(time) {

    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, 35, 60);
        this.scene.rotate(-0.5, 1, 0, 0);
        this.background.display();
        this.scene.popMatrix();
    }
}