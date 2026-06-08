"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type SplitRevealProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function SplitReveal({
  text,
  className,
  delay = 0,
}: SplitRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    if (reducedMotion || !ref.current || !window.matchMedia("(min-width: 768px)").matches) {
      return undefined;
    }

    let cleanup = () => {};
    let cancelled = false;

    void import("gsap")
      .then(({ gsap }) => {
        if (cancelled || !ref.current) return;

        const chars = Array.from(ref.current.querySelectorAll<HTMLElement>(".split-reveal__char"));

        gsap.set(chars, {
          yPercent: 112,
          opacity: 0,
          rotateX: -28,
          transformOrigin: "50% 100%",
        });

        const tween = gsap.to(chars, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.92,
          delay,
          stagger: 0.014,
          ease: "power4.out",
        });

        cleanup = () => {
          tween.kill();
          gsap.set(chars, { clearProps: "all" });
        };
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [delay, reducedMotion]);

  return (
    <span ref={ref} className={cn("split-reveal", className)} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span className="split-reveal__word" aria-hidden="true" key={`${word}-${wordIndex}`}>
          {Array.from(word).map((char, charIndex) => (
            <span className="split-reveal__char" key={`${char}-${charIndex}`}>
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
