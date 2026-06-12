"use client";

import type { CSSProperties } from "react";
import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

type Props = {
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  scale: MotionValue<number>;
  channelOpacity: MotionValue<number>;
  orbitOpacity: MotionValue<number>;
  gridOpacity: MotionValue<number>;
};

const planeOne = { "--z": "24px", "--delay": "-0.8s" } as CSSProperties;
const planeTwo = { "--z": "44px", "--delay": "-2.4s" } as CSSProperties;
const planeThree = { "--z": "32px", "--delay": "-4s" } as CSSProperties;

export function MobileSceneCore({
  rotateY,
  rotateX,
  scale,
  channelOpacity,
  orbitOpacity,
  gridOpacity,
}: Props) {
  return (
    <div className="mobile-core-shell" aria-hidden="true">
      {/* Technical map grid */}
      <motion.div
        className="technical-map absolute inset-0"
        style={{ opacity: gridOpacity }}
      />

      {/* Vertical cadmium axis */}
      <motion.div
        className="absolute bottom-0 top-0 w-px bg-cadmium/60 shadow-[0_0_20px_rgba(255,59,48,0.24)]"
        style={{ left: "57%", opacity: channelOpacity }}
      />

      {/* Horizontal accent */}
      <div className="absolute left-0 right-0 top-[46%] h-px bg-white/[0.07]" />

      {/* Slab - all rotation/scale driven by motion values */}
      <div className="flex h-full items-center justify-center">
        <motion.div
          className="mobile-core-slab"
          style={{ rotateY, rotateX, scale }}
        >
          <div className="mobile-core-shadow" />
          <div className="mobile-core-ruler" />
          <div className="mobile-core-layer one depth-plane" style={planeOne} />
          <div className="mobile-core-layer two depth-plane" style={planeTwo} />
          <div className="mobile-core-layer three depth-plane" style={planeThree} />
          <motion.div className="mobile-core-channel" style={{ opacity: channelOpacity }} />
        </motion.div>
      </div>

      {/* Orbital marks */}
      <motion.div
        className="orbital-mark absolute left-[5%] top-[14%] h-9 w-20"
        style={{ opacity: orbitOpacity }}
      />
      <motion.div
        className="orbital-mark absolute bottom-[14%] right-[6%] h-12 w-8"
        style={{ opacity: orbitOpacity }}
      />

      {/* Accent lines */}
      <div className="absolute left-[12%] right-[30%] top-[24%] h-px bg-white/[0.10]" />
      <div className="absolute bottom-[22%] left-[18%] right-[16%] h-px bg-cadmium/25" />
    </div>
  );
}
