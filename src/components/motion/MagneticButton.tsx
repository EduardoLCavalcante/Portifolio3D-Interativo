"use client";

import { MouseEvent, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";

type MagneticButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  external,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 190, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 190, damping: 18, mass: 0.35 });

  const onMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.2);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden border px-6 text-sm font-medium transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cadmium active:translate-y-px",
        variant === "primary" && "border-frost bg-frost text-carbon hover:border-white hover:bg-white",
        variant === "secondary" &&
          "border border-white/15 bg-white/[0.03] text-frost hover:border-white/30 hover:bg-white/[0.07]",
        className,
      )}
      style={{ x: springX, y: springY }}
    >
      <span className="absolute inset-0 translate-y-full bg-cadmium transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <span
        className={cn(
          "relative z-10 transition-colors duration-300 group-hover:text-white",
          variant === "primary" ? "text-carbon" : "text-frost",
        )}
      >
        {children}
      </span>
    </motion.a>
  );
}
