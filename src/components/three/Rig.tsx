"use client";

import { useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { sceneSignal } from "@/lib/scene-signal";

type CameraState = {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
};

const cameraStates: CameraState[] = [
  { position: [0.25, 0.22, 5.6], target: [0.45, 0, 0], fov: 38 },
  { position: [1.35, 0.72, 5.1], target: [0.05, 0.05, 0], fov: 42 },
  { position: [-1.35, 0.82, 5.9], target: [-0.2, 0.1, -0.4], fov: 40 },
  { position: [0.2, 1.25, 6.45], target: [0, 0.05, -0.35], fov: 44 },
  { position: [-0.95, -0.08, 5.45], target: [0.12, -0.12, 0], fov: 39 },
  { position: [1.1, 0.45, 5.85], target: [0.1, 0, 0], fov: 41 },
  { position: [0.1, 0.1, 5.25], target: [0, 0, 0], fov: 37 },
];

function smooth(value: number) {
  return value * value * (3 - 2 * value);
}

export function Rig() {
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => new THREE.Vector3(), []);
  const nextPosition = useMemo(() => new THREE.Vector3(), []);
  const nextTarget = useMemo(() => new THREE.Vector3(), []);
  const fromPosition = useMemo(() => new THREE.Vector3(), []);
  const toPosition = useMemo(() => new THREE.Vector3(), []);
  const fromTarget = useMemo(() => new THREE.Vector3(), []);
  const toTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const index = sceneSignal.sectionIndex;
    const current = cameraStates[index] ?? cameraStates[0];
    const following = cameraStates[Math.min(index + 1, cameraStates.length - 1)] ?? current;
    const mix = smooth(sceneSignal.sectionProgress);

    fromPosition.fromArray(current.position);
    toPosition.fromArray(following.position);
    fromTarget.fromArray(current.target);
    toTarget.fromArray(following.target);

    nextPosition.copy(fromPosition).lerp(toPosition, mix);
    nextTarget.copy(fromTarget).lerp(toTarget, mix);

    nextPosition.x += sceneSignal.pointerX * 0.34;
    nextPosition.y += sceneSignal.pointerY * 0.2;
    nextPosition.z -= sceneSignal.contactProgress * 0.45;
    nextTarget.x += sceneSignal.pointerX * 0.1;
    nextTarget.y += sceneSignal.pointerY * 0.08;

    easing.damp3(camera.position, nextPosition, 0.25, delta);
    easing.damp3(target, nextTarget, 0.22, delta);
    easing.damp(camera, "fov", THREE.MathUtils.lerp(current.fov, following.fov, mix), 0.25, delta);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });

  return null;
}
