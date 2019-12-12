class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;

        this.gameboards = new MyGameboards(scene);
        
        this.theme = [];
        this.animator = [];
    }

    display() {
        this.gameboards.display();
    }



}