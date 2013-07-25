varying vec3 vNormal;
uniform float uTime;
uniform float uBeatTime;
uniform float uBeat;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normalMatrix * vec3(normal);
  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);
}