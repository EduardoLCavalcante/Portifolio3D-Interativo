"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { createBackgroundMaterial } from "@/components/three/materials/backgroundMaterial";
import { sceneSignal } from "@/lib/scene-signal";

export function Background() {
  const material = useMemo(() => createBackgroundMaterial(), []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScroll.value = sceneSignal.scroll;
  });

  return (
    <mesh scale={[18, 18, 18]} frustumCulled={false}>
      <sphereGeometry args={[1, 64, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
