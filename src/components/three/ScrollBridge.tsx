"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/client-capabilities";
import { clamp01, sceneSections, sceneSignal } from "@/lib/scene-signal";

type SectionMetric = {
  top: number;
  height: number;
};

function measureSections(): SectionMetric[] {
  return sceneSections.map((id) => {
    const element = document.getElementById(id);
    if (!element) {
      return { top: 0, height: window.innerHeight };
    }

    return {
      top: element.offsetTop,
      height: Math.max(element.offsetHeight, window.innerHeight),
    };
  });
}

export function ScrollBridge() {
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let metrics = measureSections();
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = prefersReducedMotion();

    const update = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const deltaTime = Math.max(16, now - lastTime);
      const rawVelocity = (scrollY - lastY) / deltaTime;
      const viewportAnchor = scrollY + window.innerHeight * 0.48;

      let sectionIndex = 0;
      for (let index = 0; index < metrics.length; index += 1) {
        const metric = metrics[index];
        if (viewportAnchor >= metric.top) {
          sectionIndex = index;
        }
      }

      const active = metrics[sectionIndex] ?? metrics[0];

      sceneSignal.scroll = clamp01(scrollY / maxScroll);
      sceneSignal.scrollY = scrollY;
      sceneSignal.velocity += (rawVelocity - sceneSignal.velocity) * 0.12;
      sceneSignal.sectionIndex = sectionIndex;
      sceneSignal.sectionProgress = clamp01((viewportAnchor - active.top) / active.height);

      const contact = metrics[metrics.length - 1];
      if (contact) {
        const start = contact.top - window.innerHeight * 0.95;
        const end = contact.top - window.innerHeight * 0.15;
        sceneSignal.contactProgress = reducedMotion
          ? 1
          : clamp01((scrollY - start) / Math.max(1, end - start));
      }

      document.documentElement.style.setProperty(
        "--contact-progress",
        reducedMotion ? "1" : sceneSignal.contactProgress.toFixed(4),
      );

      if (!hasFinePointer) {
        sceneSignal.pointerX = Math.sin(sceneSignal.scroll * Math.PI * 2) * 0.12;
        sceneSignal.pointerY = Math.cos(sceneSignal.scroll * Math.PI * 1.4) * 0.08;
      }

      lastY = scrollY;
      lastTime = now;
      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!hasFinePointer) return;

      sceneSignal.pointerX = event.clientX / window.innerWidth - 0.5;
      sceneSignal.pointerY = event.clientY / window.innerHeight - 0.5;
    };

    const handleResize = () => {
      metrics = measureSections();
      requestUpdate();
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const resizeObserver =
      "ResizeObserver" in window
        ? new ResizeObserver(() => {
            metrics = measureSections();
            requestUpdate();
          })
        : undefined;

    sceneSections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        resizeObserver?.observe(element);
      }
    });

    update();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver?.disconnect();

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return null;
}
