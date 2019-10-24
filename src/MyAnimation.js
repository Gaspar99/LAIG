class MyAnimation {
    constructor(scene) {
        this.scene = scene;

        this.ma = [];

    }

    update(time) {
        
    }

    apply() {
        this.scene.multMatrix(this.ma);
    }

    
    
}

