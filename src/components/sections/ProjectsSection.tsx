import { ProjectsShowcase } from "@/components/sections/ProjectsShowcase";
import { getPublicGithubRepos } from "@/lib/github";
import { siteConfig } from "@/lib/constants";

export async function ProjectsSection() {
  const result = await getPublicGithubRepos(siteConfig.githubUsername);

  return (
    <section
      id="evidence"
      className="section-transition section-y border-y border-white/[0.08] bg-[#090a0b]"
    >
      <div className="container-shell">
        <ProjectsShowcase projects={result.repos} source={result.source} error={result.error} />
      </div>
    </section>
  );
}
