"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.35,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[80] h-px w-full origin-left bg-cadmium"
      style={{ scaleX: reducedMotion ? scrollYProgress : scaleX }}
      aria-hidden="true"
    />
  );
}
