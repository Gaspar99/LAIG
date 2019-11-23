#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
    // Original texture
    vec4 originalColor = texture2D(uSampler, vTextureCoord);
    
    //Calculations to get a texture with darker corners
    float distX = (0.5 - vTextureCoord.x)*(0.5 - vTextureCoord.x);
    float distY = (0.5 - vTextureCoord.y)*(0.5 - vTextureCoord.y);
    float dist = sqrt(distX + distY); //Distance from Text Coord to center of texture
    
    float maxDist = sqrt(0.5); //Max Distance possible
    float distPercentage = (maxDist - dist) / maxDist; //Value on range 0 to 1
    
    vec4 color = vec4(originalColor.rgb * distPercentage, 1.0);

    // Calculations to add white horizontal stripes to texture
    float yCoord = vTextureCoord.y + timeFactor*0.01;

    if(mod(yCoord * 10.0, 2.0) > 1.7)
        color = texture2D(uSampler2, vTextureCoord);

    gl_FragColor = vec4(color.rgb, 1.0);
}

