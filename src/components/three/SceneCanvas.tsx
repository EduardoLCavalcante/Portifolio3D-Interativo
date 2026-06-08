"use client";

import { Suspense, useEffect, useState } from "react";
import { AdaptiveDpr, AdaptiveEvents, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Background } from "@/components/three/scene/Background";
import { Lighting } from "@/components/three/scene/Lighting";
import { Lattice } from "@/components/three/scene/Lattice";
import { Particles } from "@/components/three/scene/Particles";
import { Phone } from "@/components/three/scene/Phone";
import { ShardField } from "@/components/three/scene/ShardField";
import { Effects } from "@/components/three/Effects";
import { Rig } from "@/components/three/Rig";
import type { SceneQuality } from "@/lib/scene-quality";
import { sceneSignal } from "@/lib/scene-signal";

type SceneCanvasProps = {
  tier: SceneQuality;
  onReady: () => void;
  onContextLost: () => void;
};

function ReadySignal({ onReady }: { onReady: () => void }) {
  const [ready, setReady] = useState(false);

  useFrame(() => {
    if (!ready) {
      setReady(true);
      sceneSignal.ready = true;
      onReady();
    }
  });

  return null;
}

export function SceneCanvas({ tier, onReady, onContextLost }: SceneCanvasProps) {
  const [paused, setPaused] = useState(false);
  const [degraded, setDegraded] = useState(tier.level === "low");

  useEffect(() => {
    const handleVisibility = () => setPaused(document.hidden);
    handleVisibility();

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <Canvas
      className="webgl-scene-canvas"
      dpr={[1, tier.maxDpr]}
      camera={{ position: [0.25, 0.2, 5.6], fov: 38, near: 0.1, far: 40 }}
      gl={{
        alpha: true,
        antialias: tier.level !== "low",
        powerPreference: "high-performance",
      }}
      frameloop={paused ? "never" : "always"}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.toneMapping = THREE.AgXToneMapping ?? THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.86;
        gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true });
      }}
    >
      <Suspense fallback={null}>
        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
          onIncline={() => {
            if (tier.level === "high") {
              setDegraded(false);
            }
          }}
        />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
        <Background />
        <Lighting />
        <Lattice tier={tier} />
        <ShardField tier={degraded ? { ...tier, shards: Math.floor(tier.shards * 0.62) } : tier} />
        <Particles tier={degraded ? { ...tier, particles: Math.floor(tier.particles * 0.45) } : tier} />
        <Phone tier={degraded ? { ...tier, level: "low" } : tier} />
        <Rig />
        <Effects tier={tier} degraded={degraded} />
        <ReadySignal onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
