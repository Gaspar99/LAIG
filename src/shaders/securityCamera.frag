#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
    vec4 original_color = texture2D(uSampler, vTextureCoord);
    
    float distX = (0.5 - vTextureCoord.x)*(0.5 - vTextureCoord.x);
    float distY = (0.5 - vTextureCoord.y)*(0.5 - vTextureCoord.y);

    float dist = sqrt(distX + distY);
    float maxDist = sqrt(0.5);

    gl_FragColor = vec4(original_color.rgb * (maxDist - dist), 1.0);
}

