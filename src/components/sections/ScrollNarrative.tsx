import { DesktopScrollExperience } from "@/components/sections/DesktopScrollExperience";
import { MobileScrollExperience } from "@/components/sections/MobileScrollExperience";

export function ScrollNarrative() {
  return (
    <div id="behavior" className="section-transition">
      <DesktopScrollExperience />
      <MobileScrollExperience />
    </div>
  );
}
