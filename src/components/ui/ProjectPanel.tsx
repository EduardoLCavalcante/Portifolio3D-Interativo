"use client";

import { PointerEvent, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { GithubRepo } from "@/lib/github";
import { formatProjectTitle } from "@/lib/github";
import { sceneSignal } from "@/lib/scene-signal";
import { cn } from "@/lib/cn";

type ProjectPanelProps = {
  project: GithubRepo;
  featured?: boolean;
};

export function ProjectPanel({ project, featured }: ProjectPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 170, damping: 24, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 170, damping: 24, mass: 0.45 });
  const description =
    project.description?.trim() || "Repositório público sem descrição. Ver GitHub para contexto técnico.";

  const title = formatProjectTitle(project.name);

  const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    sceneSignal.projectTitle = title;
    sceneSignal.projectSeed = project.id % 997;
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType !== "mouse" || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const strength = featured ? 0.035 : 0.026;
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    x.set((localX - rect.width / 2) * strength);
    y.set((localY - rect.height / 2) * strength);
    ref.current.style.setProperty("--panel-x", `${localX}px`);
    ref.current.style.setProperty("--panel-y", `${localY}px`);
  };

  const resetMagnet = () => {
    x.set(0);
    y.set(0);
    if (sceneSignal.projectTitle === title) sceneSignal.projectTitle = null;
  };

  return (
    <motion.article
      ref={ref}
      className={cn(
        "project-sheen magnetic-panel group relative isolate overflow-hidden border-t border-white/[0.12] py-7 transition duration-500 hover:border-cadmium/60",
        featured && "min-h-[560px] border-y border-white/[0.12] py-8 md:py-10",
      )}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetMagnet}
      style={{ x: springX, y: springY }}
      initial={reducedMotion ? undefined : { opacity: 0 }}
      whileInView={reducedMotion ? undefined : { opacity: 1 }}
      viewport={reducedMotion ? undefined : { once: true, margin: "-10%" }}
      transition={
        reducedMotion ? undefined : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
      }
      whileTap={reducedMotion ? undefined : { scale: 0.988 }}
    >
      <div
        className={cn(
          "absolute bottom-0 right-0 top-0 hidden w-[42%] project-axis opacity-45 md:block",
          project.language === "TypeScript" && "bg-cadmium/[0.035]",
          project.language === "Python" && "bg-white/[0.03]",
          project.language !== "TypeScript" && project.language !== "Python" && "bg-ash/[0.035]",
        )}
      />
      <div className="absolute bottom-0 left-0 h-px w-24 bg-cadmium transition-all duration-500 group-hover:w-48" />

      <div
        className={cn(
          "relative z-10 grid h-full gap-8 md:grid-cols-[0.32fr_0.68fr]",
          featured && "md:grid-cols-[0.34fr_0.66fr]",
        )}
      >
        <div className="flex items-start justify-between gap-4 md:block">
          <p className="font-mono text-sm text-cadmium">
            {project.language ?? "Repositório"}
          </p>
          <div className="mt-8 hidden h-24 w-px bg-white/16 md:block" />
        </div>

        <div className={cn("flex flex-col", featured && "justify-end")}>
          <h3
            className={cn(
              "text-balance font-semibold text-frost",
              featured ? "text-5xl leading-[0.92] md:text-7xl" : "text-3xl leading-none md:text-4xl",
            )}
          >
            {formatProjectTitle(project.name)}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-7 text-ash">{description}</p>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-ash/70">
            Atualizado em {project.updatedLabel}{project.stars > 0 ? ` - ${project.stars} estrela${project.stars !== 1 ? "s" : ""}` : ""}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {[
              project.language ?? "Código",
              ...(project.stars > 0 ? [`${project.stars} estrela${project.stars !== 1 ? "s" : ""}`] : []),
              project.homepage ? "Demo" : "Repositório",
            ].map((tech) => (
              <span
                className="border border-white/[0.1] px-3 py-1 text-xs text-ash/80"
                key={tech}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 flex gap-5 text-sm text-frost">
            {project.homepage ? (
              <a
                className="link-micro transition-colors hover:text-cadmium"
                href={project.homepage}
                target="_blank"
                rel="noreferrer"
              >
                Demo
              </a>
            ) : null}
            <a
              className="link-micro transition-colors hover:text-cadmium"
              href={project.url}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
