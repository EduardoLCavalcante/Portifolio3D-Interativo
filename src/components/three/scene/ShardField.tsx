"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createShardMaterial } from "@/components/three/materials/shardMaterial";
import type { SceneQuality } from "@/lib/scene-quality";
import { sceneSignal } from "@/lib/scene-signal";

type ShardFieldProps = {
  tier: SceneQuality;
};

type ShardSeed = {
  x: number;
  y: number;
  z: number;
  phase: number;
  orbit: number;
  width: number;
  height: number;
};

const dummy = new THREE.Object3D();

function createSeeds(count: number): ShardSeed[] {
  return Array.from({ length: count }, (_, index) => {
    const ring = Math.sqrt(index / count);
    const angle = index * 2.399963 + Math.random() * 0.32;

    return {
      x: Math.cos(angle) * ring,
      y: (Math.random() - 0.5) * 1.65,
      z: Math.sin(angle) * ring,
      phase: Math.random() * Math.PI * 2,
      orbit: angle,
      width: 0.06 + Math.random() * 0.22,
      height: 0.018 + Math.random() * 0.13,
    };
  });
}

export function ShardField({ tier }: ShardFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(() => createSeeds(tier.shards), [tier.shards]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 1, 1), []);
  const material = useMemo(() => createShardMaterial(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.elapsedTime;
    const section = sceneSignal.sectionIndex;
    const progress = sceneSignal.sectionProgress;
    const scatter = section === 0 ? 0.55 : 1.1 + section * 0.12;
    const tunnel = section === 3 || section === 4 ? 1.45 : 0.75;
    const ribbon = section === 1 ? 1 : 0;
    const lattice = section >= 2 ? 1 : 0.35;

    for (let index = 0; index < seeds.length; index += 1) {
      const seed = seeds[index];
      const wave = Math.sin(time * 0.55 + seed.phase + sceneSignal.scroll * 7.0);
      const orbit = seed.orbit + sceneSignal.scroll * (0.6 + seed.z * 0.2);
      const radius = (2.0 + seed.z * 1.7) * scatter;
      const latticeSnap = Math.round(seed.x * 6) / 6;
      const x = THREE.MathUtils.lerp(
        Math.cos(orbit) * radius + sceneSignal.pointerX * 0.32,
        latticeSnap * 5.6,
        lattice * 0.52,
      );
      const y = seed.y * (2.8 + lattice) + wave * 0.12 + progress * 0.42;
      const z = THREE.MathUtils.lerp(
        Math.sin(orbit) * radius - tunnel,
        seed.z * 3.2 - 1.2,
        lattice * 0.45,
      );

      dummy.position.set(x, y + ribbon * Math.sin(seed.x * 6 + time) * 0.36, z);
      dummy.rotation.set(
        sceneSignal.pointerY * 0.18 + wave * 0.06,
        orbit + Math.PI * 0.5 + sceneSignal.pointerX * 0.28,
        seed.phase * 0.08 + sceneSignal.scroll * 0.6,
      );
      dummy.scale.set(seed.width * (1 + section * 0.03), seed.height, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    material.uniforms.uTime.value = time;
    material.uniforms.uScroll.value = sceneSignal.scroll;
    material.uniforms.uSection.value = section;
    material.uniforms.uOpacity.value =
      (tier.level === "low" ? 0.4 : 0.55) * (1 - sceneSignal.contactProgress * 0.72);
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, seeds.length]}
      frustumCulled={false}
    />
  );
}
