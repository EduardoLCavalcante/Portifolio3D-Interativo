import { DesktopScrollExperience } from "@/components/sections/DesktopScrollExperience";
import { MobileScrollNarrative } from "@/components/sections/MobileScrollNarrative";

export function ScrollNarrative() {
  return (
    <div id="behavior" className="section-transition">
      <DesktopScrollExperience />
      <MobileScrollNarrative />
    </div>
  );
}
