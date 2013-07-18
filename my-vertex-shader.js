            varying vec3 vNormal;
            varying vec2 vUv;
            uniform float uTime;
            uniform float uBeatTime;
            uniform float uBeat;
            
            void main() {
                vUv = vec2(uv.x - 0.5, uv.y - 0.5); // center vUv
                vNormal = normalMatrix * vec3(normal);
                gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4((0.8 + 0.2 * uBeat) * position, 1.0);
            }
