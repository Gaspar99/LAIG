var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        var children = viewsNode.children;

        var defaultViewID = this.reader.getString(viewsNode, "default");
        if (defaultViewID == null) 
            return "no default view defined";

        this.defaultViewID = defaultViewID;

        this.views = [];
        var numViews = 0;
        
        var grandChildren = [];

        for (var i = 0; i < children.length; i++) {

            var viewProperties = [];
            
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            
            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            viewProperties.push(children[i].nodeName);
            viewProperties.push(viewId);
            
            //Near property
            var near = this.reader.getFloat(children[i], "near"); 
            if (!(near != null && !isNaN(near)))
                return "unable to parse near property of view for ID = " + viewId;
            else viewProperties.push(near);

            //Far property
            var far = this.reader.getFloat(children[i], "far"); 
            if (!(far != null && !isNaN(far)))
                return "unable to parse far property of view for ID = " + viewId;
            else viewProperties.push(far);

            grandChildren = children[i].children;
            // Specifications for the current view.

            var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            
            var fromPos = [];
            var fromIndex = nodeNames.indexOf("from");            
            if (fromIndex != -1) {
                var aux = this.parseCoordinates3D(grandChildren[fromIndex], "from position of view for ID " + viewId);
                if (!Array.isArray(aux))
                    return aux;

                fromPos = aux;
            }
            else
                return "from position of view undefined for ID = " + viewId;

            var toPos = [];
            var toIndex = nodeNames.indexOf("to");            
            if (toIndex != -1) {
                var aux = this.parseCoordinates3D(grandChildren[toIndex], "to position of view for ID " + viewId);
                if (!Array.isArray(aux))
                    return aux;

                toPos = aux;
            }
            else
                return "to position of view undefined for ID = " + viewId;

            viewProperties.push(...[fromPos, toPos]);
            
            if (children[i].nodeName == "perspective") {
                //Angle property
                var angle = this.reader.getFloat(children[i], "angle"); 
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle property of view for ID = " + viewId; 
                else viewProperties.push(angle);
            }           
            else if (children[i].nodeName == "ortho") {

                var upDirection = [];
                var upIndex = nodeNames.indexOf("up");            
                if (upIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[upIndex], "up direction of view for ID " + viewId);
                    if (!Array.isArray(aux))
                        return aux;

                    upDirection = aux;
                }
                else
                    upDirection = [0,1,0];

                viewProperties.push(upDirection);

                //Left property
                var left = this.reader.getFloat(children[i], "left")
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left property of view for ID = " + viewId; 
                else viewProperties.push(left);
                
                //Right property
                var right = this.reader.getFloat(children[i], "right")
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right property of view for ID = " + viewId; 
                else viewProperties.push(right);
                
                //Top property
                var top = this.reader.getFloat(children[i], "top")
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top property of view for ID = " + viewId; 
                else viewProperties.push(top);
                
                //Bottom property
                var bottom = this.reader.getFloat(children[i], "bottom")
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom property of view for ID = " + viewId; 
                else viewProperties.push(bottom);
            }

            this.views[viewId] = viewProperties;
            numViews++;
        }

        if (numViews == 0)
            return "at least one view must be defined";
        
        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            
            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            var fileName = this.reader.getString(children[i], 'file');
            if (fileName == null)
                return "no file defined for texture with id " + textureId;
            
            if (!fileName.startsWith("scenes/images"))
                return "File must be placed in folder \'scenes/images\'";
            if ( !(fileName.endsWith(".jpg") || fileName.endsWith(".png")) ) 
                return "File must have the extension \'.jpg\' or \'.png\'";
                  
            this.textures[textureId] = new CGFtexture(this.scene, fileName);
            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";
        
        this.log("Parsed textures")
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var numMaterials = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            var material = [];
            var attributeNames = [];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["emission", "ambient", "diffuse", "specular"]);
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            //Shininess
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess)))
                return "unable to parse shininess property of view for ID = " + materialID; 
            else material.push(shininess);

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    var color = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " color for ID" + materialID);

                    if (!Array.isArray(color))
                        return color;

                    material.push(color);
                }
                else
                    return "material " + attributeNames[j] + " undefined for ID = " + materialID;
            }
            
            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(material[0]);
            newMaterial.setEmission(material[1][0], material[1][1], material[1][2], material[1][3]);
            newMaterial.setAmbient(material[2][0], material[2][1], material[2][2], material[2][3]);
            newMaterial.setDiffuse(material[3][0], material[3][1], material[3][2], material[3][3]);
            newMaterial.setSpecular(material[4][0], material[4][1], material[4][2], material[4][3]);

            this.materials[materialID] = newMaterial;
            numMaterials++;
        }

        if (numMaterials == 0)
            return "at least one material must be defined";

        this.log("Parsed materials");

        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                switch (grandChildren[j].nodeName) {
                    case 'translate': {
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                        break;
                    }
                    case 'scale': {
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "scale transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates))
                            return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                        break;
                    }                
                    case 'rotate': {
                        // Angle
                        var angle = this.reader.getFloat(grandChildren[j], "angle");
                        if (!(angle != null && !isNaN(angle)))
                            return "unable to parse angle property of transformation for ID = " + transformationID;
                        
                        // Axis
                        var axis = this.reader.getString(grandChildren[j], "axis");
                        if (axis == null)
                            return "unable to parse axis property of transformation for ID = " + transformationID;

                        switch (axis) {
                            case "x": {
                                transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD);
                                break;
                            }
                            case "y": {
                                transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD);
                                break;
                            }
                            case "z": {
                                transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD);
                                break;
                            } 
                        }

                        break;
                    }    
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        var grandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            switch (primitiveType) {
                case 'rectangle': {
                    // x1
                    var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                    // y1
                    var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                    // x2
                    var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                    if (!(x2 != null && !isNaN(x2) && x2 > x1))
                        return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                    // y2
                    var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                    if (!(y2 != null && !isNaN(y2) && y2 > y1))
                        return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                    var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                    this.primitives[primitiveId] = rect;

                    break;
                }
                case 'triangle': {
                    // x1
                    var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                    if (!(x1 != null && !isNaN(x1)))
                        return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                    // y1
                    var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                    if (!(y1 != null && !isNaN(y1)))
                        return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                    // z1
                    var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                    if (!(z1 != null && !isNaN(z1)))
                        return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                    // x2
                    var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                    if (!(x2 != null && !isNaN(x2)))
                        return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                    // y2
                    var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                    if (!(y2 != null && !isNaN(y2)))
                        return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                    // z2
                    var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                    if (!(z2 != null && !isNaN(z2)))
                        return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                    // x3
                    var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                    if (!(x3 != null && !isNaN(x3)))
                        return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                    // y3
                    var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                    if (!(y3 != null && !isNaN(y3)))
                        return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                    // z3
                    var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                    if (!(z3 != null && !isNaN(z3)))
                        return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                    var triangle = new MyTriangle(this.scene, primitiveId, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                    this.primitives[primitiveId] = triangle;

                    break;
                }
                case 'cylinder': {
                    // Base
                    var base = this.reader.getFloat(grandChildren[0], 'base');
                    if (!(base != null && !isNaN(base)))
                        return "unable to parse base value of the primitive for ID = " + primitiveId;
                    
                    // Top
                    var top = this.reader.getFloat(grandChildren[0], 'top');
                    if (!(top != null && !isNaN(top)))
                        return "unable to parse top value of the primitive for ID = " + primitiveId;

                    // Height
                    var height = this.reader.getFloat(grandChildren[0], 'height');
                    if (!(height != null && !isNaN(height)))
                        return "unable to parse height value of the primitive for ID = " + primitiveId;

                    // Slices
                    var slices = this.reader.getInteger(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices)))
                        return "unable to parse slices value of the primitive for ID = " + primitiveId;

                    // Stacks
                    var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                    if (!(stacks != null && !isNaN(stacks)))
                        return "unable to parse stacks value of the primitive for ID = " + primitiveId;

                    var cylinder = new MyCylinder(this.scene, primitiveId, base, top, height, slices, stacks);

                    this.primitives[primitiveId] = cylinder;

                    break;
                }
                case 'sphere': {
                    // Radius
                    var radius = this.reader.getFloat(grandChildren[0], 'radius');
                    if (!(radius != null && !isNaN(radius)))
                        return "unable to parse radius value of the primitive for ID = " + primitiveId;

                    // Slices
                    var slices = this.reader.getInteger(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices)))
                        return "unable to parse slices value of the primitive for ID = " + primitiveId;

                    // Stacks
                    var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                    if (!(stacks != null && !isNaN(stacks)))
                        return "unable to parse stacks value of the primitive for ID = " + primitiveId;
                    
                    var sphere = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                    this.primitives[primitiveId] = sphere;

                    break;
                }
                case 'torus': {
                    // Inner
                    var inner = this.reader.getFloat(grandChildren[0], 'inner');
                    if (!(inner != null && !isNaN(inner)))
                        return "unable to parse inner value of the primitive for ID = " + primitiveId;

                    // Outer
                    var outer = this.reader.getFloat(grandChildren[0], 'outer');
                    if (!(outer != null && !isNaN(outer)))
                        return "unable to parse outer value of the primitive for ID = " + primitiveId;

                    // Slices
                    var slices = this.reader.getInteger(grandChildren[0], 'slices');
                    if (!(slices != null && !isNaN(slices)))
                        return "unable to parse slices value of the primitive for ID = " + primitiveId;

                    // Loops
                    var loops = this.reader.getInteger(grandChildren[0], 'loops');
                    if (!(loops != null && !isNaN(loops)))
                        return "unable to parse loops value of the primitive for ID = " + primitiveId;

                    var torus = new MyTorus(this.scene, primitiveId, inner, outer, slices, loops);

                    this.primitives[primitiveId] = torus;
                    
                    break;
                }
            }
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentID = this.reader.getString(children[i], 'id');
            if (componentID == null)
                return "no ID defined for componentID";

            // Checks for repeated IDs.
            if (this.components[componentID] != null)
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Transformations
            var transfMatrix = [];
            mat4.identity(transfMatrix);
            var transformationIndex = nodeNames.indexOf("transformation");
            if (transformationIndex == -1) 
                return "There must be a transformation tag in a component.";

            grandgrandChildren = grandChildren[transformationIndex].children;

            if (grandgrandChildren.length != 0) {
                if (grandgrandChildren[0].nodeName == "transformationref" && grandgrandChildren.length == 1) {
                    var transfID = this.reader.getString(grandgrandChildren[0], "id");
                    if (transfID == null)
                        return "Unable to get ID of transformation for component with ID " + componentID;
    
                    transfMatrix = this.transformations[transfID];
                    if (transfMatrix == null) 
                        return "Unable to find transformation with ID " + transfID; 
                }
                else {
                    for(var j = 0; j < grandgrandChildren.length; j++) {
                        switch (grandgrandChildren[j].nodeName) {
                            case 'translate': {
                                var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "translate transformation for ID " + transfID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;
        
                                transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                                break;
                            }
                            case 'scale': {
                                var coordinates = this.parseCoordinates3D(grandgrandChildren[j], "scale transformation for ID " + transfID);
                                if (!Array.isArray(coordinates))
                                    return coordinates;
        
                                transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                                break;
                            }                
                            case 'rotate': {
                                // Angle
                                var angle = this.reader.getFloat(grandgrandChildren[j], "angle");
                                if (!(angle != null && !isNaN(angle)))
                                    return "unable to parse angle property of transformation for ID = " + transfID;
                                
                                // Axis
                                var axis = this.reader.getString(grandgrandChildren[j], "axis");
                                if (axis == null)
                                    return "unable to parse axis property of transformation for ID = " + transfID;
        
                                switch (axis) {
                                    case "x": {
                                        transfMatrix = mat4.rotateX(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD);
                                        break;
                                    }
                                    case "y": {
                                        transfMatrix = mat4.rotateY(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD);
                                        break;
                                    }
                                    case "z": {
                                        transfMatrix = mat4.rotateZ(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD);
                                        break;
                                    } 
                                }
                                break;
                            }
                            default: {
                                this.onXMLMinorError("unknown transformation tag.");
                                break;
                            }
                        }
                    }
                }
            }

            // Materials
            var componentMaterials = [];
            grandgrandChildren = [];
            var materialsIndex = nodeNames.indexOf("materials");
            if (materialsIndex == -1) 
                return "There must be a materials tag in a component.";

            grandgrandChildren = grandChildren[materialsIndex].children;

            if(grandgrandChildren.length == 0)
                return "At least one material must be specified."

            for (var j = 0; j < grandgrandChildren.length; j++) {

                var materialID = this.reader.getString(grandgrandChildren[j], "id");
                if (materialID == null)
                    return "Error reading material ID."

                var material = this.materials[materialID];
                if (material == null)
                    return "Unable to find material with ID " + materialID;

                componentMaterials.push(materialID);
            }

            // Texture
            var texture = [];
            var textureIndex = nodeNames.indexOf("texture");
            if (textureIndex == -1) 
                return "There must be a texture tag in a component.";

            var textureID = this.reader.getString(grandChildren[textureIndex], "id");
            if (textureID == null)
                return "Error reading texture ID."

            var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s', false);
            if (!(length_s != null && !isNaN(length_s))){
                this.onXMLMinorError("Undefined length_s, defaulting to 1");
                length_s = 1.0;
            }

            var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t', false);
            if (!(length_t != null && !isNaN(length_t))){
                this.onXMLMinorError("Undefined length_t, defaulting to 1");
                length_t = 1.0;
            }

            texture.push(...[textureID, length_s, length_t]);

            // Children
            var componentChildren = [];
            var primitiveChildren = [];
            grandgrandChildren = [];
            var childrenIndex = nodeNames.indexOf("children");
            if (childrenIndex == -1)
                return "There must be a children tag in a component.";

            grandgrandChildren = grandChildren[childrenIndex].children;
            if (grandgrandChildren.length == 0)
                return "No child defined for component with ID " + componentID;

            for (var j = 0; j < grandgrandChildren.length; j++) {
                var childID = this.reader.getString(grandgrandChildren[j], "id");
                if (childID == null)
                    return "Error reading child ID."
                switch (grandgrandChildren[j].nodeName) {
                    case "componentref": {
                        componentChildren.push(childID);
                        break;
                    }
                    case "primitiveref": {
                        primitiveChildren.push(childID);
                        break;
                    }
                    default: 
                        return "Invalid tag: <" + grandgrandChildren[j].nodeName + ">.";
                }
            }
            
            this.components[componentID] = new MyComponent(transfMatrix, componentMaterials, texture, componentChildren, primitiveChildren);
        }
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {   

        var rootComponent = this.components[this.idRoot];
        var materialID = rootComponent.materials[rootComponent.activeMaterial];
        var textureID = rootComponent.texture[0];
        var length_s = rootComponent.texture[1];
        var length_t = rootComponent.texture[2];

        this.processNode(this.idRoot, rootComponent.transfMatrix, materialID, textureID, length_s, length_t);
    }

    processNode(componentID, parentTransfMatrix, parentMaterialID, parentTextureID, parentLength_s, parentLength_t) {

        var component = this.components[componentID];
        
        var transfMatrix = [];
        transfMatrix = mat4.multiply(transfMatrix, parentTransfMatrix, component.transfMatrix);

        var materialID = component.materials[component.activeMaterial];

        if (materialID = "inherit")
            materialID = parentMaterialID;

        var material = this.materials[materialID];
        material.setTextureWrap('REPEAT', 'REPEAT');

        var texture = [];
        var length_s = 1, length_t = 1;

        var textureID = component.texture[0];
        if (textureID == "inherit") {
            textureID = parentTextureID;
            length_s = parentLength_s;
            length_t = parentLength_t;
        } else if (textureID != "none") {
            texture = this.textures[textureID];
            length_s = component.texture[1];
            length_t = component.texture[2]; 
        }

        texture = this.textures[textureID];
        if(textureID != "none") material.setTexture(texture);

        var primitiveChildren = component.primitiveChildren;

        this.scene.pushMatrix();
        this.scene.multMatrix(transfMatrix);
        material.apply();
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);

        for (var i = 0; i < primitiveChildren.length; i++) {
            this.primitives[primitiveChildren[i]].updateTexCoords(length_s, length_t);
            this.primitives[primitiveChildren[i]].display();
        }

        this.scene.popMatrix();

        var componentChildren = component.componentChildren;
        for (var i = 0; i < componentChildren.length; i++) {
            this.processNode(componentChildren[i], transfMatrix, materialID, textureID, length_s, length_t);
        } 

    }
}