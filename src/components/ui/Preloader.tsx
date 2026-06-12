"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/client-capabilities";
import { cn } from "@/lib/cn";

type PreloaderPhase = "loading" | "exiting" | "done";

function isDismissValue(value: string | undefined) {
  return value === "ready" || value === "fallback";
}

export function Preloader() {
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const [progress, setProgress] = useState(0);
  const phaseRef = useRef<PreloaderPhase>("loading");

  const progressLabel = useMemo(
    () => Math.round(progress).toString().padStart(2, "0"),
    [progress],
  );

  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();
    const startTime = performance.now();
    const minDuration = reduced ? 500 : 1100;
    const exitDuration = reduced ? 300 : 750;
    const safetyDuration = 6000;
    let observer: MutationObserver | undefined;
    let minTimer: number | undefined;
    let safetyTimer: number | undefined;
    let exitTimer: number | undefined;
    let raf: number | undefined;
    let dismissing = false;

    const restore = () => {
      root.classList.remove("preloader-active");
    };

    const clearTimer = (timer: number | undefined) => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };

    const beginExit = () => {
      if (dismissing) return;

      dismissing = true;
      phaseRef.current = "exiting";
      setProgress(100);
      setPhase("exiting");
      restore();
      observer?.disconnect();
      clearTimer(minTimer);
      clearTimer(safetyTimer);

      if (raf) {
        window.cancelAnimationFrame(raf);
      }

      exitTimer = window.setTimeout(() => {
        phaseRef.current = "done";
        setPhase("done");
      }, exitDuration);
    };

    const dismiss = () => {
      const elapsed = performance.now() - startTime;
      const remaining = minDuration - elapsed;

      if (remaining > 0) {
        clearTimer(minTimer);
        minTimer = window.setTimeout(beginExit, remaining);
        return;
      }

      beginExit();
    };

    const checkReadiness = () => {
      if (isDismissValue(root.dataset.webgl)) {
        dismiss();
      }
    };

    const tick = () => {
      if (dismissing || phaseRef.current !== "loading") return;

      const elapsed = performance.now() - startTime;
      const eased = 92 * (1 - Math.exp(-elapsed / 1600));
      setProgress(Math.min(92, eased));
      raf = window.requestAnimationFrame(tick);
    };

    root.classList.add("preloader-active");
    observer = new MutationObserver(checkReadiness);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-webgl"],
    });
    safetyTimer = window.setTimeout(dismiss, safetyDuration);
    raf = window.requestAnimationFrame(tick);
    checkReadiness();

    return () => {
      restore();
      observer?.disconnect();
      clearTimer(minTimer);
      clearTimer(safetyTimer);
      clearTimer(exitTimer);

      if (raf) {
        window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      className={cn("preloader", phase === "exiting" && "preloader--exit")}
      role="status"
      aria-live="polite"
      aria-label="Carregando portfólio"
    >
      <div className="preloader__shell">
        <div className="preloader__mark" aria-hidden="true">
          <svg
            className="preloader__svg"
            viewBox="0 0 128 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="preloader__ring"
              d="M64 8C94.928 8 120 33.072 120 64C120 94.928 94.928 120 64 120C33.072 120 8 94.928 8 64C8 33.072 33.072 8 64 8Z"
            />
            <path className="preloader__slash" d="M48 92L62 32" />
            <text className="preloader__letters" x="72" y="73">
              EC
            </text>
          </svg>
          <span className="preloader__orbit" />
        </div>

        <div className="preloader__track" aria-hidden="true">
          <span
            className="preloader__fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>

        <div className="preloader__meta">
          <span className="preloader__label">preparando interface</span>
          <span className="preloader__value">{progressLabel}</span>
        </div>
      </div>
    </div>
  );
}
