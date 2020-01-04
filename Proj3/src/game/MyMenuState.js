class MyMenuState extends MyGameState {
    constructor(scene, gameOrchestrator) {
        super(scene, gameOrchestrator);

        this.gameInfo = gameOrchestrator.gameInfo;
        this.theme = gameOrchestrator.theme;

        this.background = new MyRectangle(scene, -20, 20, -13, 13);
        this.play = new MyRectangle(scene, -10, 10, -2.5, 2.5);
        this.theme1 = new MyRectangle(scene, -3, 3, -1, 1);
        this.theme2 = new MyRectangle(scene, -3, 3, -1, 1);
        this.playopt1 = new MyRectangle(scene, -5, 5, -1, 1);
        this.playopt2 = new MyRectangle(scene, -5, 5, -1, 1);
        this.playopt3 = new MyRectangle(scene, -5, 5, -1, 1);
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

        this.scene.pushMatrix();
        this.scene.translate(0, 32, -64);
        this.scene.rotate(0.5, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.play.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-13, 29, -68);
        this.scene.rotate(0.5, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.theme1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-5, 29, -68);
        this.scene.rotate(0.5, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.theme2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5, 47, -64);
        this.scene.rotate(0.5, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.playopt1.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5, 44, -66);
        this.scene.rotate(0.5, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.playopt2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(5, 41, -68);
        this.scene.rotate(0.5, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.playopt1.display();
        this.scene.popMatrix();
    }
}