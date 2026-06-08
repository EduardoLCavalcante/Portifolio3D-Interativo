"use client";

import { useEffect, useState } from "react";

/** Returns true when mobile+coarse AND prefers-reduced-motion is NOT set. SSR-safe. */
export function useMobileMotion(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      const isMobile =
        window.matchMedia("(max-width: 767px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      const ok = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setEnabled(isMobile && ok);
    };

    check();

    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);

  return enabled;
}
