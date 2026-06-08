import * as THREE from "three";

export type GridMaterial = THREE.ShaderMaterial & {
  uniforms: {
    uTime: { value: number };
    uScroll: { value: number };
    uIntensity: { value: number };
  };
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntensity;
  varying vec2 vUv;

  float grid(vec2 uv, float scale, float width) {
    vec2 line = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
    float value = min(line.x, line.y);
    return 1.0 - min(value, 1.0);
  }

  void main() {
    vec2 uv = vUv;
    float g1 = grid(uv, 18.0, 0.03);
    float g2 = grid(uv + vec2(uScroll * 0.06, 0.0), 5.0, 0.02) * 0.36;
    float scan = smoothstep(0.04, 0.0, abs(uv.y - fract(uTime * 0.06 + uScroll * 0.45)));
    float vignette = smoothstep(0.9, 0.2, distance(uv, vec2(0.52, 0.48)));
    vec3 color = mix(vec3(0.34, 0.4, 0.45), vec3(1.0, 0.19, 0.12), scan * 0.65);
    float alpha = (g1 * 0.13 + g2 * 0.18 + scan * 0.16) * vignette * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function createGridMaterial(): GridMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uIntensity: { value: 0.5 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }) as GridMaterial;
}
