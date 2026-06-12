"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { MobileSceneCore } from "@/components/sections/MobileSceneCore";
import { scrollSteps } from "@/data/scroll-steps";

// Narrative states: intro + the 4 scroll steps
const states = [
  {
    counter: "00",
    title: "Processo claro, sem perder a experiência.",
    copy: "Do requisito ao protótipo navegável, cada etapa melhora clareza, responsividade e intenção.",
  },
  ...scrollSteps.map((s, i) => ({
    counter: String(i + 1).padStart(2, "0"),
    title: s.title,
    copy: s.copy,
  })),
];

const N = states.length; // 5

export function MobileScrollNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
  });

  // Nucleus continuous transforms
  const rotateY = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [0, -6, -3, 2, 0]);
  const rotateX = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [2, 4, 6, 2, 0]);
  const coreScale = useTransform(progress, [0, 0.5, 0.75, 1], [1, 1.06, 1.04, 1]);
  const channelOpacity = useTransform(
    progress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.3, 0.55, 0.85, 0.65, 0.4],
  );
  const orbitOpacity = useTransform(progress, [0, 0.45, 0.7, 1], [0.15, 0.58, 0.48, 0.22]);
  const gridOpacity = useTransform(progress, [0, 0.25, 0.5, 1], [0.18, 0.28, 0.42, 0.22]);

  // Per-state cross-fade opacity and y
  // Each state occupies 1/N of progress [0..1].
  // Fade in during first half of its window, hold, fade out during last half.
  const stateOpacities = states.map((_, i) => {
    const start = i / N;
    const peak = (i + 0.35) / N;
    const holdEnd = (i + 0.65) / N;
    const end = (i + 1) / N;
    return useTransform(
      progress,
      [
        Math.max(0, start - 0.01),
        peak,
        holdEnd,
        Math.min(1, end + 0.01),
      ],
      [0, 1, 1, 0],
    );
  });

  const stateY = states.map((_, i) => {
    const start = i / N;
    const peak = (i + 0.35) / N;
    const holdEnd = (i + 0.65) / N;
    const end = (i + 1) / N;
    return useTransform(
      progress,
      [
        Math.max(0, start - 0.01),
        peak,
        holdEnd,
        Math.min(1, end + 0.01),
      ],
      [14, 0, 0, -14],
    );
  });

  // Reduced-motion fallback: static stacked layout
  if (reducedMotion) {
    return (
      <section className="relative border-y border-white/[0.08] bg-[#090909] lg:hidden">
        <div className="container-shell py-16">
          <p className="font-mono text-sm text-cadmium">Método</p>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[0.98] text-frost">
            Processo claro, sem perder a experiência.
          </h2>
          <div className="mt-10 divide-y divide-white/[0.08]">
            {scrollSteps.map((step, i) => (
              <article className="py-7" key={step.title}>
                <p className="font-mono text-xs text-cadmium">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-3xl font-semibold leading-none text-frost">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-ash">{step.copy}</p>
              </article>
            ))}
          </div>
          <a
            className="mt-8 inline-flex h-12 items-center justify-center border border-white/14 px-5 text-sm text-frost transition duration-300 active:translate-y-px"
            href="#evidence"
          >
            Ver projetos
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-y border-white/[0.08] bg-carbon/72 lg:hidden"
      // Height drives the scroll distance: N states x 82svh each
      style={{ height: `${N * 82}svh` }}
    >
        {/* Sticky viewport */}
      <div className="sticky top-0 h-[100svh] overflow-hidden">

        {/* 3D nucleus - full-screen */}
        <div className="webgl-fallback-only absolute inset-0 z-0" aria-hidden="true">
          <MobileSceneCore
            rotateY={rotateY}
            rotateX={rotateX}
            scale={coreScale}
            channelOpacity={channelOpacity}
            orbitOpacity={orbitOpacity}
            gridOpacity={gridOpacity}
          />
        </div>

        {/* Scrim - only covers lower portion; top half stays pure 3D */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-[62%] pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to top, #090909 18%, rgba(9,9,9,0.82) 54%, transparent 100%)",
          }}
        />

        {/* Section label - top */}
        <div className="absolute top-[5.5rem] left-0 right-0 z-20 container-shell">
          <p className="font-mono text-sm text-cadmium/80">Método</p>
        </div>

        {/* Progress dots */}
        <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-[6px]">
          {states.map((_, i) => (
            <motion.span
              key={i}
              className="block h-[3px] w-[3px] rounded-full bg-cadmium"
              style={{ opacity: stateOpacities[i] }}
            />
          ))}
        </div>

        {/* Cross-fading text states */}
        {states.map((state, i) => {
          const isLast = i === N - 1;
          return (
            <motion.div
              key={state.counter}
              className="absolute inset-x-0 bottom-0 z-20 container-shell pb-12"
              style={{
                opacity: stateOpacities[i],
                y: stateY[i],
              }}
              aria-hidden={i !== 0}
            >
              <p className="font-mono text-xs text-cadmium">{state.counter}</p>
              <h3 className="mt-3 max-w-2xl text-balance text-3xl font-semibold leading-[1.02] text-frost md:text-4xl">
                {state.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-ash/90">{state.copy}</p>
              {isLast && (
                <a
                  className="mt-6 inline-flex h-11 items-center justify-center border border-white/20 px-5 text-sm text-frost transition duration-300 active:translate-y-px"
                  href="#evidence"
                >
                  Ver projetos
                </a>
              )}
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}
