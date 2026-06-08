"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const interactiveSelector = "a, button, [role='button'], input, textarea, select";

export function Cursor() {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(-40);
  const y = useMotionValue(-40);
  const springX = useSpring(x, { stiffness: 620, damping: 42, mass: 0.42 });
  const springY = useSpring(y, { stiffness: 620, damping: 42, mass: 0.42 });
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    document.documentElement.classList.add("has-custom-cursor");

    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setHovering(Boolean((event.target as Element | null)?.closest(interactiveSelector)));
    };

    const handlePointerDown = () => setPressed(true);
    const handlePointerUp = () => setPressed(false);
    const handlePointerLeave = () => setVisible(false);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [reducedMotion, x, y]);

  if (reducedMotion) return null;

  return (
    <motion.div
      className="custom-cursor"
      data-visible={visible}
      data-hovering={hovering}
      data-pressed={pressed}
      style={{ x: springX, y: springY }}
      aria-hidden="true"
    >
      <span className="custom-cursor__core" />
      <span className="custom-cursor__ring" />
    </motion.div>
  );
}
