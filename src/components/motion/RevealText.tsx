"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type RevealTextProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function RevealText({ text, className, delay = 0 }: RevealTextProps) {
  const reducedMotion = useReducedMotion();
  const words = text.split(" ");

  if (reducedMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={cn("inline-block overflow-hidden", className)}>
      {words.map((word, index) => (
        <motion.span
          className="mr-[0.28em] inline-block"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + index * 0.045,
          }}
          key={`${word}-${index}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
