"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SceneFallback } from "@/components/3d/SceneFallback";
import { Preloader } from "@/components/three/Preloader";
import { ScrollBridge } from "@/components/three/ScrollBridge";
import { canUseWebGL, getSceneQuality, lowSceneQuality, type SceneQuality } from "@/lib/scene-quality";
import { sceneSignal } from "@/lib/scene-signal";
import {
  prefersReducedMotion,
  runWhenIdle,
  shouldSkipHeavyMedia,
} from "@/lib/client-capabilities";
import { cn } from "@/lib/cn";

const SceneCanvas = dynamic(
  () => import("@/components/three/SceneCanvas").then((module) => module.SceneCanvas),
  { ssr: false },
);

type SceneStatus = "boot" | "fallback" | "webgl";

export function SceneRoot() {
  const [status, setStatus] = useState<SceneStatus>("boot");
  const [ready, setReady] = useState(false);
  const [tier, setTier] = useState<SceneQuality>(lowSceneQuality);

  useEffect(() => {
    let cancelled = false;

    if (prefersReducedMotion() || shouldSkipHeavyMedia() || !canUseWebGL()) {
      setStatus("fallback");
      document.documentElement.dataset.webgl = "fallback";
      return undefined;
    }

    const cleanup = runWhenIdle(() => {
      if (cancelled) return;

      const quality = getSceneQuality();
      sceneSignal.tier = quality.level;
      setTier(quality);
      setStatus("webgl");
      document.documentElement.dataset.webgl = "pending";
    }, 900);

    return () => {
      cancelled = true;
      cleanup();
      delete document.documentElement.dataset.webgl;
    };
  }, []);

  const handleReady = () => {
    setReady(true);
    document.documentElement.dataset.webgl = "ready";
  };

  const handleContextLost = () => {
    sceneSignal.ready = false;
    setReady(false);
    setStatus("fallback");
    document.documentElement.dataset.webgl = "fallback";
  };

  const showCanvas = status === "webgl";
  const showPoster = status !== "webgl" || !ready;

  return (
    <>
      <ScrollBridge />
      <div className="webgl-scene-root" aria-hidden="true">
        <div className={cn("scene-poster", !showPoster && "scene-poster--hidden")}>
          <SceneFallback />
        </div>
        {showCanvas ? (
          <SceneCanvas tier={tier} onReady={handleReady} onContextLost={handleContextLost} />
        ) : null}
      </div>
      <Preloader active={showCanvas} ready={ready} />
    </>
  );
}
