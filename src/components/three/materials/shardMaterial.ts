import * as THREE from "three";

export type ShardMaterial = THREE.ShaderMaterial & {
  uniforms: {
    uTime: { value: number };
    uScroll: { value: number };
    uSection: { value: number };
    uOpacity: { value: number };
  };
};

const vertexShader = `
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
    vDepth = smoothstep(-5.0, 5.0, worldPosition.z);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uSection;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vDepth;

  float lineMask(vec2 uv, float width) {
    vec2 edge = min(uv, 1.0 - uv);
    float border = smoothstep(width, 0.0, min(edge.x, edge.y));
    float vertical = smoothstep(width, 0.0, abs(fract(uv.x * 3.0) - 0.5) - 0.49);
    return max(border, vertical * 0.18);
  }

  void main() {
    float border = lineMask(vUv, 0.018);
    float sweep = smoothstep(0.08, 0.0, abs(vUv.y - fract(uTime * 0.08 + uScroll + vDepth)));
    float sectionPulse = 0.62 + 0.38 * sin(uTime * 1.4 + uSection * 1.9 + vDepth * 3.0);
    vec3 frost = vec3(0.46, 0.52, 0.58);
    vec3 cadmium = vec3(1.0, 0.19, 0.12);
    vec3 color = mix(frost, cadmium, sweep * 0.78 + border * 0.34);
    float alpha = (border * 0.3 + sweep * 0.2 + 0.02) * sectionPulse * uOpacity;

    if (alpha < 0.012) discard;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function createShardMaterial(): ShardMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uSection: { value: 0 },
      uOpacity: { value: 0.8 },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }) as ShardMaterial;
}
