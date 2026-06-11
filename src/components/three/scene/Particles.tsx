"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneQuality } from "@/lib/scene-quality";
import { sceneSignal } from "@/lib/scene-signal";

type ParticlesProps = {
  tier: SceneQuality;
};

function createParticleMaterial() {
  return new THREE.PointsMaterial({
    color: "#79808b",
    size: 0.015,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}

export function Particles({ tier }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(tier.particles * 3);

    for (let index = 0; index < tier.particles; index += 1) {
      const i3 = index * 3;
      data[i3] = (Math.random() - 0.5) * 10;
      data[i3 + 1] = (Math.random() - 0.5) * 6;
      data[i3 + 2] = (Math.random() - 0.5) * 8;
    }

    return data;
  }, [tier.particles]);
  const material = useMemo(() => createParticleMaterial(), []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    pointsRef.current.rotation.y = clock.elapsedTime * 0.018 + sceneSignal.pointerX * 0.06;
    pointsRef.current.rotation.x = sceneSignal.pointerY * 0.04;
    material.opacity =
      (tier.level === "low" ? 0 : 0.1 + Math.abs(sceneSignal.velocity) * 0.06) *
      (1 - sceneSignal.contactProgress * 0.72);
  });

  if (!tier.particles) return null;

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}
