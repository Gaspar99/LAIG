class MyGameboard extends CGFobject {
    constructor(scene, component, width, height) {
        super(scene);

        this.component = component;
        this.width = width;
        this.height = height;
    }

    display() {
        this.scene.sceneGraph.processNode(this.component);
    }
}