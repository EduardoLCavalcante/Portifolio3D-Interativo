"use client";

import { useEffect, useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { createFresnelRimMaterial } from "@/components/three/materials/fresnelRim";
import type { SceneQuality } from "@/lib/scene-quality";
import { createPhoneUITexture } from "@/lib/phone-ui-texture";
import { sceneSignal } from "@/lib/scene-signal";

type PhoneProps = {
  tier: SceneQuality;
};

const sectionRotations: [number, number, number][] = [
  [0.08, -0.36, -0.03],
  [0.18, 0.22, 0.02],
  [-0.08, -0.16, 0.08],
  [0.12, 0.34, -0.08],
  [-0.18, -0.04, 0.04],
  [0.04, -0.28, -0.02],
  [0, 0.12, 0],
];

function getTextureSize(tier: SceneQuality) {
  if (tier.level === "high" && !tier.mobile) {
    return { width: 540, height: 1170 };
  }

  if (tier.level === "medium") {
    return { width: tier.mobile ? 360 : 440, height: tier.mobile ? 780 : 954 };
  }

  return { width: 320, height: 693 };
}

export function Phone({ tier }: PhoneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const textureAccumulator = useRef(0);
  const rimMaterial = useMemo(() => createFresnelRimMaterial(), []);
  const textureSize = useMemo(() => getTextureSize(tier), [tier]);
  const phoneUI = useMemo(
    () => createPhoneUITexture(textureSize.width, textureSize.height),
    [textureSize.height, textureSize.width],
  );
  const screenMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: phoneUI.texture,
        toneMapped: false,
        transparent: true,
        opacity: 1,
      }),
    [phoneUI.texture],
  );
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#08090a",
        metalness: 0.6,
        roughness: 0.4,
      }),
    [],
  );
  const sideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#15191e",
        metalness: 0.72,
        roughness: 0.34,
      }),
    [],
  );
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.055,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    [],
  );
  const cadmiumMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#ff3b30",
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      phoneUI.dispose();
      screenMaterial.dispose();
      bodyMaterial.dispose();
      sideMaterial.dispose();
      glassMaterial.dispose();
      cadmiumMaterial.dispose();
      rimMaterial.dispose();
    };
  }, [
    bodyMaterial,
    cadmiumMaterial,
    glassMaterial,
    phoneUI,
    rimMaterial,
    screenMaterial,
    sideMaterial,
  ]);

  useFrame(({ clock }, delta) => {
    const sectionRotation = sectionRotations[sceneSignal.sectionIndex] ?? sectionRotations[0];
    const velocityBoost = Math.min(0.32, Math.abs(sceneSignal.velocity) * 0.18);
    const textureFps = tier.level === "high" && !tier.mobile ? 18 : 12;
    const cp = sceneSignal.contactProgress;
    const contactZ = cp * (tier.mobile ? 0.8 : 1.7);
    const contactScale = cp * (tier.mobile ? 0.42 : 0.9);

    textureAccumulator.current += delta;
    if (textureAccumulator.current >= 1 / textureFps && (screenMaterial.opacity > 0.03 || cp < 0.98)) {
      phoneUI.draw({
        scroll: sceneSignal.scroll,
        sectionIndex: sceneSignal.sectionIndex,
        time: clock.elapsedTime,
      });
      textureAccumulator.current = 0;
    }

    rimMaterial.uniforms.uTime.value = clock.elapsedTime;
    rimMaterial.uniforms.uScroll.value = sceneSignal.scroll;
    easing.damp(
      rimMaterial.uniforms.uIntensity,
      "value",
      0.42 + velocityBoost + sceneSignal.sectionProgress * 0.08 + cp * 0.5,
      0.22,
      delta,
    );
    easing.damp(screenMaterial, "opacity", 1 - cp, 0.18, delta);

    if (groupRef.current) {
      const heroX = tier.mobile ? 0.72 : 1.05;
      const sectionX = tier.mobile ? 0.16 : 0.24;
      const baseScale = tier.mobile ? 1.03 : 1.1;
      const xTarget = (sceneSignal.sectionIndex === 0 ? heroX : sectionX) * (1 - cp);

      easing.damp3(
        groupRef.current.position,
        [
          xTarget,
          -0.02 + Math.sin(sceneSignal.scroll * Math.PI) * 0.16,
          contactZ,
        ],
        0.28,
        delta,
      );
      easing.dampE(
        groupRef.current.rotation,
        [
          sectionRotation[0] + sceneSignal.pointerY * 0.22,
          sectionRotation[1] + sceneSignal.pointerX * 0.32,
          sectionRotation[2],
        ],
        0.24,
        delta,
      );
      easing.damp3(
        groupRef.current.scale,
        [
          baseScale + sceneSignal.sectionProgress * 0.035 + contactScale,
          baseScale + sceneSignal.sectionIndex * 0.008 + contactScale,
          baseScale + contactScale,
        ],
        0.3,
        delta,
      );
    }

    if (rimRef.current) {
      rimRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.45) * 0.018;
    }
  });

  return (
    <group ref={groupRef} position={[tier.mobile ? 0.72 : 1.05, -0.02, 0]}>
      <RoundedBox args={[1.06, 2.18, 0.13]} radius={0.1} smoothness={12} material={bodyMaterial} />

      <RoundedBox
        ref={rimRef}
        args={[1.12, 2.24, 0.16]}
        radius={0.115}
        smoothness={12}
        material={rimMaterial}
      />

      <mesh position={[0, 0, 0.074]}>
        <planeGeometry args={[0.92, 2.02]} />
        <primitive object={screenMaterial} attach="material" />
      </mesh>

      <mesh position={[-0.18, 0.34, 0.078]} rotation={[0, 0, -0.12]} scale={[0.32, 1.6, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={glassMaterial} attach="material" />
      </mesh>

      <mesh position={[0, 0.94, 0.083]} scale={[0.18, 0.018, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#050607" transparent opacity={0.92} />
      </mesh>

      <mesh position={[0.58, 0.42, 0.005]} scale={[0.018, 0.28, 0.035]} material={sideMaterial}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh position={[0.58, -0.26, 0.005]} scale={[0.016, 0.2, 0.032]} material={cadmiumMaterial}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh position={[0.42, 0, 0.089]} scale={[0.009, 2.02, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#ff3b30"
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
