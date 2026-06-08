"use client";

import { useProgress } from "@react-three/drei";
import { cn } from "@/lib/cn";

type PreloaderProps = {
  active: boolean;
  ready: boolean;
};

export function Preloader({ active, ready }: PreloaderProps) {
  const { progress } = useProgress();

  if (!active) return null;

  const displayProgress = ready ? 100 : Math.max(14, Math.round(progress));

  return (
    <div
      className={cn("scene-preloader", ready && "scene-preloader--hidden")}
      aria-hidden="true"
    >
      <span className="scene-preloader__line" style={{ transform: `scaleX(${displayProgress / 100})` }} />
      <span className="scene-preloader__value">{String(displayProgress).padStart(2, "0")}</span>
    </div>
  );
}
