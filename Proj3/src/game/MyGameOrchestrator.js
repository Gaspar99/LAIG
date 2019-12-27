class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameboards = new MyGameboards(scene);

        this.theme = [];
        this.animator = [];
    }

    processPick(id, obj) {
        
    }

    display() {
        this.scene.registerPicking();
        this.scene.clearPickRegistration();
        this.gameboards.display();
    }



}