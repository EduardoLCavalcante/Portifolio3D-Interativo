export type SceneTierName = "high" | "medium" | "low";

export type SceneSectionId =
  | "surface"
  | "behavior"
  | "systems"
  | "evidence"
  | "signature"
  | "about"
  | "contact";

export type SceneSignal = {
  scroll: number;
  scrollY: number;
  sectionIndex: number;
  sectionProgress: number;
  contactProgress: number;
  pointerX: number;
  pointerY: number;
  velocity: number;
  tier: SceneTierName;
  ready: boolean;
};

export const sceneSections: SceneSectionId[] = [
  "surface",
  "behavior",
  "systems",
  "evidence",
  "signature",
  "about",
  "contact",
];

export const sceneSignal: SceneSignal = {
  scroll: 0,
  scrollY: 0,
  sectionIndex: 0,
  sectionProgress: 0,
  contactProgress: 0,
  pointerX: 0,
  pointerY: 0,
  velocity: 0,
  tier: "medium",
  ready: false,
};

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
