import {
  hasCoarsePointer,
  matchesViewport,
  shouldSkipHeavyMedia,
} from "@/lib/client-capabilities";
import type { SceneTierName } from "@/lib/scene-signal";

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number;
};

export type SceneQuality = {
  level: SceneTierName;
  maxDpr: number;
  shards: number;
  particles: number;
  transmissionSamples: number;
  transmissionResolution: number;
  bloom: boolean;
  dof: boolean;
  smaa: boolean;
  chromaticAberration: number;
  mobile: boolean;
};

export const lowSceneQuality: SceneQuality = {
  level: "low",
  maxDpr: 1,
  shards: 520,
  particles: 0,
  transmissionSamples: 3,
  transmissionResolution: 128,
  bloom: true,
  dof: false,
  smaa: false,
  chromaticAberration: 0.035,
  mobile: true,
};

function getRendererHint() {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) return "";

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "";

    return String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)).toLowerCase();
  } catch {
    return "";
  }
}

export function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function getSceneQuality(): SceneQuality {
  const mobile = matchesViewport("(max-width: 767px)") || hasCoarsePointer();
  const navigatorWithMemory = navigator as NavigatorWithDeviceMemory;
  const memory = navigatorWithMemory.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const renderer = getRendererHint();
  const weakRenderer = /swiftshader|llvmpipe|software|microsoft basic/.test(renderer);

  if (shouldSkipHeavyMedia() || weakRenderer || memory <= 2 || cores <= 4) {
    return {
      ...lowSceneQuality,
      mobile,
      maxDpr: mobile ? 1 : 1.15,
    };
  }

  if (mobile || memory <= 4 || cores <= 6) {
    return {
      level: "medium",
      maxDpr: mobile ? 1.35 : 1.6,
      shards: mobile ? 780 : 1350,
      particles: mobile ? 180 : 520,
      transmissionSamples: mobile ? 4 : 6,
      transmissionResolution: mobile ? 160 : 256,
      bloom: true,
      dof: false,
      smaa: true,
      chromaticAberration: mobile ? 0.04 : 0.055,
      mobile,
    };
  }

  return {
    level: "high",
    maxDpr: 2,
    shards: 2600,
    particles: 980,
    transmissionSamples: 8,
    transmissionResolution: 384,
    bloom: true,
    dof: true,
    smaa: true,
    chromaticAberration: 0.075,
    mobile,
  };
}
