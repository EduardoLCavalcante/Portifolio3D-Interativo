"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SceneFallback } from "@/components/3d/SceneFallback";
import { siteConfig } from "@/lib/constants";
import { matchesViewport, runWhenIdle, shouldSkipHeavyMedia } from "@/lib/client-capabilities";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

export function SplineScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRenderSpline, setShouldRenderSpline] = useState(false);

  useEffect(() => {
    const hasScene = Boolean(siteConfig.splineSceneUrl);
    const mobile = matchesViewport("(max-width: 767px)");

    if (!hasScene || mobile || shouldSkipHeavyMedia()) {
      return undefined;
    }

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    let cleanupIdle = () => {};
    let observer: IntersectionObserver | undefined;
    let cancelled = false;

    const queueSplineLoad = () => {
      cleanupIdle();
      cleanupIdle = runWhenIdle(() => {
        if (!cancelled) {
          setShouldRenderSpline(true);
        }
      }, 1600);
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer?.disconnect();
          queueSplineLoad();
        },
        { rootMargin: "480px 0px" },
      );

      observer.observe(container);
    } else {
      queueSplineLoad();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanupIdle();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[340px] w-full overflow-hidden sm:min-h-[430px] md:min-h-[720px]"
    >
      {shouldRenderSpline ? <Spline scene={siteConfig.splineSceneUrl} /> : <SceneFallback />}
    </div>
  );
}
