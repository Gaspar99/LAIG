class MyPiece extends CGFobject {
    constructor(scene, type, tile){
        super(scene);

        this.tile = tile;
        this.type = type;
    }

    setTile(tile) {
        this.tile = tile;
    }

    display() {
        this.type.display();
    }
}