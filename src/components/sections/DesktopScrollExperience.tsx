"use client";

import { useEffect, useRef } from "react";
import { scrollSteps } from "@/data/scroll-steps";
import { prefersReducedMotion, shouldSkipHeavyMedia } from "@/lib/client-capabilities";

export function DesktopScrollExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      prefersReducedMotion() ||
      shouldSkipHeavyMedia() ||
      !sectionRef.current ||
      !visualRef.current
    ) {
      return undefined;
    }

    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let media: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !sectionRef.current || !visualRef.current) return;

        gsap.registerPlugin(ScrollTrigger);
        const visual = visualRef.current;

        const mediaContext = gsap.matchMedia();
        media = mediaContext;

        mediaContext.add("(min-width: 768px)", () => {
          ctx = gsap.context(() => {
            const panels = gsap.utils.toArray<HTMLElement>(".narrative-copy");
            const layers = gsap.utils.toArray<HTMLElement>(".narrative-layer");

            gsap.set(panels, { autoAlpha: 0, y: 24 });
            gsap.set(panels[0], { autoAlpha: 1, y: 0 });

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=320%",
                scrub: 0.8,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            timeline
              .to(visual, { rotateY: -18, rotateX: 6, scale: 1.04, duration: 1 })
              .to(layers[0], { x: -54, z: 40, opacity: 0.92, duration: 1 }, "<")
              .to(panels[0], { autoAlpha: 0, y: -22, duration: 0.24 }, 0.76)
              .to(panels[1], { autoAlpha: 1, y: 0, duration: 0.32 }, 0.92)
              .to(visual, { rotateY: 11, rotateX: -2, scale: 0.96, duration: 1 })
              .to(layers[1], { x: 62, y: -22, z: 72, opacity: 0.95, duration: 1 }, "<")
              .to(".narrative-pulse", { opacity: 1, scaleY: 1.1, duration: 0.65 }, "<")
              .to(panels[1], { autoAlpha: 0, y: -22, duration: 0.24 }, 1.78)
              .to(panels[2], { autoAlpha: 1, y: 0, duration: 0.32 }, 1.94)
              .to(visual, { rotateY: -5, rotateX: 8, scale: 1.12, duration: 1 })
              .to(layers[2], { x: -30, y: 34, z: 110, opacity: 0.98, duration: 1 }, "<")
              .to(".narrative-grid", { opacity: 0.58, duration: 0.7 }, "<")
              .to(panels[2], { autoAlpha: 0, y: -22, duration: 0.24 }, 2.78)
              .to(panels[3], { autoAlpha: 1, y: 0, duration: 0.32 }, 2.94)
              .to(visual, { rotateY: 0, rotateX: 0, scale: 0.9, duration: 1 })
              .to(layers, { x: 0, y: 0, z: 0, opacity: 0.72, duration: 1 }, "<");
          }, sectionRef);

          ScrollTrigger.refresh();

          return () => ctx?.revert();
        });
      },
    );

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate hidden min-h-[100dvh] overflow-hidden border-y border-white/[0.08] bg-[#090909] md:block"
    >
      <div className="absolute inset-y-0 left-[12%] w-px bg-white/[0.07]" />
      <div className="absolute inset-y-0 right-[34%] hidden w-px bg-white/[0.07] lg:block" />

      <div className="container-shell grid min-h-[100dvh] items-center gap-12 py-24 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative z-10">
          <p className="font-mono text-sm text-cadmium" data-reveal="soft">
            01 / comportamento
          </p>
          <div className="relative mt-7 min-h-[18rem] max-w-xl motion-reduce:min-h-0">
            {scrollSteps.map((step, index) => (
              <div
                className={`desktop-narrative-copy narrative-copy ${
                  index === 0 ? "opacity-100" : "opacity-0"
              }`}
                key={step.title}
              >
                <h2 className="text-balance text-5xl font-semibold leading-[0.95] text-frost md:text-7xl">
                  {step.title}
                </h2>
                <p className="mt-7 text-lg leading-8 text-ash">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual-shell stage-depth relative flex min-h-[560px] items-center justify-center">
          <div
            ref={visualRef}
            className="relative h-[560px] w-[min(82vw,620px)] shadow-[0_50px_150px_rgba(0,0,0,0.5)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="narrative-grid technical-map absolute inset-x-8 bottom-12 top-10 opacity-25" />
            <div className="narrative-pulse absolute bottom-0 right-[28%] top-0 w-px origin-center scale-y-75 bg-cadmium/80 opacity-35 shadow-[0_0_34px_rgba(255,59,48,0.34)]" />
            <div className="narrative-layer absolute left-8 right-24 top-20 h-28 border border-white/14 bg-white/[0.055]" />
            <div className="narrative-layer absolute left-24 right-8 top-60 h-20 border border-white/12 bg-white/[0.04]" />
            <div className="narrative-layer absolute bottom-20 left-0 right-36 h-32 border border-white/12 bg-white/[0.05]" />
            <div className="absolute -right-2 top-24 h-32 w-10 border border-white/10 bg-white/[0.032]" />
            <div className="absolute -left-8 bottom-28 h-40 w-12 border border-cadmium/24 bg-cadmium/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
