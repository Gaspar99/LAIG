
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;
    gl_Position = vec4(aVertexPosition, 1.0); 
}

