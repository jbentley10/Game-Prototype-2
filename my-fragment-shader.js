#define CURVE (20.0)
#define SPEED (6.0)
#define DENSITY (2.0)

varying vec3 vNormal;
uniform float uTime;
uniform float uBeatTime;
uniform float uBeat;
varying vec2 vUv;

void main() {
    vec3 light = vec3(1.0, 1.0, 1.0);
    light = normalize(light);
    vec3 nvNormal = normalize(vNormal);
    float prod = max(0.0, dot(nvNormal, light));
    float tval = abs(cos(uBeatTime * 3.14159));
    float ang = atan(vUv.y, vUv.x);
    float dist = length(vUv) * CURVE;
    float t = ang * DENSITY + uTime * SPEED;
    gl_FragColor = vec4(tval, prod, 1.0, 1.0);
    //gl_FragColor = vec4(abs(sin(t + dist)), 0.0, 1.0, 1.0);
}
