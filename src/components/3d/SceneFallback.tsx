import type { CSSProperties } from "react";

export function SceneFallback() {
  const planeOne = { "--z": "34px", "--delay": "-0.8s" } as CSSProperties;
  const planeTwo = { "--z": "82px", "--delay": "-2.4s" } as CSSProperties;
  const planeThree = { "--z": "54px", "--delay": "-4s" } as CSSProperties;

  return (
    <div className="hero-visual-shell stage-depth relative flex min-h-[340px] items-center justify-center sm:min-h-[430px] md:min-h-[720px]">
      <div className="absolute inset-y-16 left-[16%] w-px bg-white/14 md:inset-y-20" aria-hidden="true" />
      <div className="absolute inset-y-8 right-[23%] w-px bg-cadmium/70 shadow-[0_0_22px_rgba(255,59,48,0.3)] md:shadow-[0_0_30px_rgba(255,59,48,0.34)]" />
      <div className="orbital-mark absolute left-[5%] top-[18%] h-12 w-32 opacity-50 md:left-[10%] md:h-16 md:w-44" />
      <div className="orbital-mark absolute bottom-[18%] right-[3%] h-24 w-16 opacity-45 md:h-32 md:w-24" />
      <div className="absolute right-[13%] top-[14%] h-px w-36 bg-white/18 md:w-56" />
      <div className="absolute bottom-[16%] left-[14%] h-px w-44 bg-cadmium/45 md:w-72" />

      <div className="responsive-slab">
        <div className="slab-shadow" />
        <div className="slab-ruler" />
        <div className="slab-layer depth-plane one" style={planeOne} />
        <div className="slab-layer depth-plane two" style={planeTwo} />
        <div className="slab-layer depth-plane three" style={planeThree} />
        <div className="slab-channel" />
      </div>
    </div>
  );
}
