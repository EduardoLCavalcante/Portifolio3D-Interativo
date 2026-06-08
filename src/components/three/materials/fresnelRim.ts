import * as THREE from "three";

export type FresnelRimMaterial = THREE.ShaderMaterial & {
  uniforms: {
    uTime: { value: number };
    uIntensity: { value: number };
    uScroll: { value: number };
  };
};

const vertexShader = `
  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDirW = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uScroll;
  varying vec3 vNormalW;
  varying vec3 vViewDirW;

  void main() {
    float fresnel = pow(1.0 - max(dot(normalize(vNormalW), normalize(vViewDirW)), 0.0), 2.4);
    float pulse = 0.72 + 0.28 * sin(uTime * 2.1 + uScroll * 8.0);
    vec3 cadmium = vec3(1.0, 0.18, 0.11);
    vec3 frost = vec3(0.9, 0.96, 1.0);
    vec3 color = mix(frost * 0.28, cadmium, fresnel * pulse);
    float alpha = smoothstep(0.08, 0.88, fresnel) * uIntensity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function createFresnelRimMaterial(): FresnelRimMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.9 },
      uScroll: { value: 0 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  }) as FresnelRimMaterial;
}
