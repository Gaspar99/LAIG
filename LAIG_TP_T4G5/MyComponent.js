/**
 * MyComponent
 * @constructor
 * @param transfMatrix - Transformation Matrix
 * @param materials - Array with the list of materials
 * @param texture - Array with texture ID, length s and length t
 * @param componentChildren - Array with the list of children that are components
 * @param primitiveChildren - Array with the list of children that are primitives
 */
class MyComponent {
    constructor(transfMatrix, materials, texture, componentChildren, primitiveChildren) {

        this.transfMatrix = transfMatrix;
        this.materials = materials;
        this.texture = texture;
        this.componentChildren = componentChildren;
        this.primitiveChildren = primitiveChildren;
        this.activeMaterial = 0;

    }
}