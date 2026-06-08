"use client";

import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { SceneQuality } from "@/lib/scene-quality";

type EffectsProps = {
  tier: SceneQuality;
  degraded: boolean;
};

export function Effects({ tier, degraded }: EffectsProps) {
  const dof = tier.dof && !degraded;
  const bloomIntensity = tier.level === "high" && !degraded ? 0.46 : 0.3;

  return (
    <EffectComposer multisampling={tier.smaa && !degraded ? 2 : 0} enableNormalPass={dof}>
      {tier.bloom ? (
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={0.52}
          luminanceSmoothing={0.62}
          mipmapBlur
        />
      ) : (
        <></>
      )}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[tier.chromaticAberration * 0.012, tier.chromaticAberration * 0.008]}
        radialModulation
        modulationOffset={0.28}
      />
      {dof ? (
        <DepthOfField
          target={[0, 0, 0]}
          focalLength={0.034}
          bokehScale={1.65}
          height={540}
        />
      ) : (
        <></>
      )}
      <Noise premultiply opacity={degraded ? 0.015 : 0.026} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.24} darkness={0.82} />
      {tier.smaa && !degraded ? <SMAA /> : <></>}
    </EffectComposer>
  );
}
