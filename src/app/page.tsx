import { AboutSection } from "@/components/sections/AboutSection";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { Hero3D } from "@/components/sections/Hero3D";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ScrollNarrative } from "@/components/sections/ScrollNarrative";
import { SkillsSystem } from "@/components/sections/SkillsSystem";

export default function Home() {
  return (
    <main>
      <Hero3D />
      <ScrollNarrative />
      <EcosystemSection />
      <ProjectsSection />
      <SkillsSystem />
      <AboutSection />
      <ContactCTA />
    </main>
  );
}
