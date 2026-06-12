"use client";

import { PointerEvent, useMemo, useState } from "react";
import { ProjectPanel } from "@/components/ui/ProjectPanel";
import type { GithubRepo } from "@/lib/github";
import { formatProjectTitle } from "@/lib/github";
import { sceneSignal } from "@/lib/scene-signal";
import { cn } from "@/lib/cn";

type ProjectsShowcaseProps = {
  projects: GithubRepo[];
  source: "github" | "fallback";
  error?: string;
};

const allLanguagesLabel = "Todos";

function getLanguages(projects: GithubRepo[]) {
  const languages = new Set(
    projects.map((project) => project.language).filter((language): language is string => Boolean(language)),
  );

  return [allLanguagesLabel, ...Array.from(languages)];
}

export function ProjectsShowcase({ projects, source, error }: ProjectsShowcaseProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(allLanguagesLabel);
  const languages = useMemo(() => getLanguages(projects), [projects]);
  const filteredProjects = useMemo(() => {
    if (selectedLanguage === allLanguagesLabel) return projects;
    return projects.filter((project) => project.language === selectedLanguage);
  }, [projects, selectedLanguage]);

  const [main, secondary, tertiary, quaternary, ...supporting] = filteredProjects;
  const secondaryProjects = [secondary, tertiary, quaternary].filter(Boolean) as GithubRepo[];

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--project-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--project-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      className="projects-stage relative"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { sceneSignal.projectTitle = null; }}
    >
      <div className="max-w-4xl">
        <p className="font-mono text-sm text-cadmium" data-reveal="soft">
          Projetos públicos
        </p>
        <h2
          className="mt-7 text-balance text-5xl font-semibold leading-[0.95] text-frost md:text-7xl"
          data-reveal="mask"
        >
          Provas públicas de front-end, produto e execução.
        </h2>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-ash" data-reveal="soft">
          Os repositórios vêm do GitHub EduardoLCavalcante. Cada card destaca escopo,
          stack e o que o projeto demonstra.
        </p>
      </div>

      <div
        className="mt-10 flex flex-col gap-5 border-y border-white/[0.09] py-5 md:flex-row md:items-center md:justify-between"
        data-reveal="soft"
      >
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <button
              key={language}
              type="button"
              className={cn(
                "magnetic-lite border px-3 py-2 text-sm transition duration-300 active:translate-y-px",
                selectedLanguage === language
                  ? "border-cadmium bg-cadmium/12 text-frost"
                  : "border-white/[0.1] text-ash hover:border-white/24 hover:text-frost",
              )}
              onClick={() => setSelectedLanguage(language)}
            >
              {language}
            </button>
          ))}
        </div>

        <div className="font-mono text-xs text-ash/65">
          {source === "fallback" ? (
            <span title={error}>Backup local do GitHub</span>
          ) : (
            <span>GitHub público / EduardoLCavalcante</span>
          )}
        </div>
      </div>

      {main ? (
        <div className="mt-14" data-reveal="soft">
          <ProjectPanel project={main} featured />
        </div>
      ) : (
        <p className="mt-14 border-y border-white/[0.1] py-10 text-ash">
          Nenhum projeto público nessa linguagem.
        </p>
      )}

      <div
        className="mt-8 grid gap-x-12 gap-y-2 lg:grid-cols-[0.56fr_0.44fr]"
        data-reveal="soft"
      >
        <div>
          {secondaryProjects.map((project) => (
            <ProjectPanel project={project} key={project.id} />
          ))}
        </div>

        {supporting.length > 0 ? (
          <div className="border-y border-white/[0.1] lg:mt-28">
            {supporting.map((project, index) => (
              <a
                className="project-row group grid gap-4 border-b border-white/[0.08] py-5 transition duration-300 last:border-b-0 hover:pl-3 md:grid-cols-[0.18fr_0.5fr_0.16fr_0.16fr]"
                href={project.url}
                key={project.id}
                target="_blank"
                rel="noreferrer"
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  sceneSignal.projectTitle = formatProjectTitle(project.name);
                  sceneSignal.projectSeed = project.id % 997;
                }}
                onPointerLeave={() => {
                  if (sceneSignal.projectTitle === formatProjectTitle(project.name)) sceneSignal.projectTitle = null;
                }}
              >
                <span className="font-mono text-xs text-cadmium">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="project-row__title text-xl font-semibold leading-none text-frost">
                  {formatProjectTitle(project.name)}
                </span>
                <span className="text-sm text-ash/80">{project.language ?? "Código"}</span>
                <span className="text-sm text-ash/80">{project.updatedLabel}</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
