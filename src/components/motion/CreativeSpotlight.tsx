"use client";

import { useEffect, useRef } from "react";
import { hasCoarsePointer, prefersReducedMotion } from "@/lib/client-capabilities";

export function CreativeSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || hasCoarsePointer()) {
      return undefined;
    }

    const element = ref.current;
    if (!element) return undefined;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    const update = () => {
      element.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;

      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return <div ref={ref} className="creative-spotlight" aria-hidden="true" />;
}
