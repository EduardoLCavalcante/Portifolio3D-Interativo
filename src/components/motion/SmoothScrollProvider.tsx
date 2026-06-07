"use client";

import { useEffect } from "react";
import {
  hasCoarsePointer,
  matchesViewport,
  prefersReducedMotion,
  shouldSkipHeavyMedia,
} from "@/lib/client-capabilities";

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (
      prefersReducedMotion() ||
      shouldSkipHeavyMedia() ||
      hasCoarsePointer() ||
      matchesViewport("(max-width: 767px)")
    ) {
      return undefined;
    }

    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          duration: 1.12,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.86,
        });

        lenis.on("scroll", ScrollTrigger.update);

        const update = (time: number) => {
          lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);

        cleanup = () => {
          gsap.ticker.remove(update);
          lenis.destroy();
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return <>{children}</>;
}
