varying vec2 vUv;
uniform sampler2D tDiffuse; // input texture

void main() {
    vec4 color = texture2D( tDiffuse, vUv );
    gl_FragColor = vec4(color.r, color.g, color.b, 1.0);
}
