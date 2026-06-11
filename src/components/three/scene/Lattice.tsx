"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { createGridMaterial } from "@/components/three/materials/gridMaterial";
import type { SceneQuality } from "@/lib/scene-quality";
import { sceneSignal } from "@/lib/scene-signal";

type LatticeProps = {
  tier: SceneQuality;
};

export function Lattice({ tier }: LatticeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(() => createGridMaterial(), []);

  useFrame(({ clock }, delta) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScroll.value = sceneSignal.scroll;
    easing.damp(
      material.uniforms.uIntensity,
      "value",
      (tier.level === "low" ? 0.32 : 0.5 + sceneSignal.sectionIndex * 0.024) *
        (1 - sceneSignal.contactProgress * 0.6),
      0.24,
      delta,
    );

    if (meshRef.current) {
      easing.damp3(
        meshRef.current.position,
        [0, -2.25 + sceneSignal.sectionProgress * 0.28, -2.4],
        0.3,
        delta,
      );
      easing.dampE(
        meshRef.current.rotation,
        [-Math.PI * 0.48, 0, sceneSignal.pointerX * 0.04],
        0.4,
        delta,
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2.2, -2.4]} frustumCulled={false}>
      <planeGeometry args={[18, 18, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
