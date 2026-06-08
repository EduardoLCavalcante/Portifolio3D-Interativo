"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { PointerEvent } from "react";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { siteConfig } from "@/lib/constants";
import { useMobileMotion } from "@/lib/use-mobile-motion";

export function Hero3D() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const mobileMotion = useMobileMotion();

  // Desktop: mouse-tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 26, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 26, mass: 0.4 });
  const visualX = useTransform(smoothX, [-0.5, 0.5], reducedMotion ? [0, 0] : [-18, 18]);
  const visualY = useTransform(smoothY, [-0.5, 0.5], reducedMotion ? [0, 0] : [14, -14]);

  // Mobile: subtle scroll parallax on the visual column
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const mobileParallaxY = useTransform(
    heroScroll,
    [0, 1],
    mobileMotion && !reducedMotion ? [0, -28] : [0, 0],
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={heroRef}
      id="surface"
      className="section-transition relative isolate min-h-[100dvh] overflow-hidden pt-20"
      onPointerMove={handlePointerMove}
    >
      <motion.div
        className="hero-cinematic-wipe motion-reduce:hidden"
        initial={{ x: "-120%", opacity: 0 }}
        animate={{ x: "120%", opacity: [0, 1, 0] }}
        transition={{ duration: 1.35, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden="true"
      />
      <div className="mouse-reactive absolute inset-y-0 left-[24%] -z-10 w-px bg-white/[0.08]" />
      <div className="mouse-reactive absolute inset-y-0 right-[18%] -z-10 w-px bg-white/[0.06]" />
      <div className="absolute bottom-0 left-0 right-0 -z-10 h-px bg-white/[0.12]" />
      <div className="hero-copy-scrim" aria-hidden="true" />

      <div className="container-shell grid min-h-[calc(100dvh-5rem)] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-20 max-w-4xl pb-8 lg:pl-24 xl:pl-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 flex items-center gap-4"
          >
            <span className="h-10 w-px rotate-12 bg-cadmium" />
            <span className="font-mono text-xs text-ash/70">
              Desenvolvedor front-end / sistemas responsivos
            </span>
          </motion.div>

          <h1
            className="max-w-[12.8ch] text-balance text-[clamp(3.1rem,15vw,11.4rem)] font-semibold leading-[0.82] text-frost md:max-w-[12.2ch]"
          >
            Eduardo Cavalcante
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-[21rem] text-base leading-7 text-ash sm:max-w-[31rem] md:text-xl md:leading-8"
            data-reveal="soft"
          >
            Interfaces responsivas construídas com React, Next.js, TypeScript, motion
            e acabamento de produto.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-col items-start gap-3 sm:flex-row"
          >
            <MagneticButton href={`mailto:${siteConfig.email}`}>Fale comigo</MagneticButton>
            <MagneticButton href="#evidence" variant="secondary">
              Ver projetos
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          className="hero-webgl-foreground relative -mr-[12vw] min-h-[340px] sm:min-h-[430px] md:-mr-[22vw] md:min-h-[520px] lg:-ml-40 lg:min-h-[760px]"
          style={{
            x: mobileMotion ? 0 : visualX,
            y: mobileMotion ? mobileParallaxY : visualY,
          }}
          initial={{ opacity: 0, scale: 0.94, rotate: -1 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="hero-webgl-foreground__scan technical-map" />
          <div className="hero-webgl-foreground__axis" />
          <div className="hero-webgl-foreground__rail hero-webgl-foreground__rail--top" />
          <div className="hero-webgl-foreground__rail hero-webgl-foreground__rail--bottom" />
          <div className="hero-webgl-foreground__mark hero-webgl-foreground__mark--left" />
          <div className="hero-webgl-foreground__mark hero-webgl-foreground__mark--right" />
        </motion.div>
      </div>

    </section>
  );
}
