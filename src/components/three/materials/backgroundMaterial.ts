import * as THREE from "three";

export type BackgroundMaterial = THREE.ShaderMaterial & {
  uniforms: {
    uTime: { value: number };
    uScroll: { value: number };
  };
};

const vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  varying vec3 vPosition;

  void main() {
    vec3 dir = normalize(vPosition);
    float horizon = smoothstep(-0.45, 0.88, dir.y);
    float cadmiumField = smoothstep(0.72, 0.08, distance(dir.xz, vec2(0.16 + sin(uTime * 0.08) * 0.08, -0.22)));
    float scrollVeil = 0.18 + 0.18 * sin(uScroll * 6.283 + dir.x * 2.0);
    vec3 carbon = vec3(0.018, 0.02, 0.022);
    vec3 graphite = vec3(0.055, 0.06, 0.065);
    vec3 cadmium = vec3(0.55, 0.065, 0.045);
    vec3 color = mix(carbon, graphite, horizon * 0.58);
    color += cadmium * cadmiumField * scrollVeil;
    gl_FragColor = vec4(color, 0.92);
  }
`;

export function createBackgroundMaterial(): BackgroundMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    depthWrite: false,
    side: THREE.BackSide,
  }) as BackgroundMaterial;
}
