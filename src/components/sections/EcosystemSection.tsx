import { ecosystemNodes } from "@/data/skills";
import { cn } from "@/lib/cn";

export function EcosystemSection() {
  return (
    <section id="systems" className="section-transition section-y relative overflow-hidden">
      <div className="container-shell grid gap-12 xl:grid-cols-[0.42fr_0.58fr] xl:items-start">
        <div className="xl:sticky xl:top-28">
          <p className="font-mono text-sm text-cadmium" data-reveal="soft">
            Stack
          </p>
          <h2
            className="mt-7 text-balance text-5xl font-semibold leading-[0.95] text-frost md:text-7xl"
            data-reveal="mask"
          >
            Ferramentas que transformam requisitos em interfaces reais.
          </h2>
          <p className="mt-8 max-w-md text-lg leading-8 text-ash" data-reveal="soft">
            React, Next.js, TypeScript, Tailwind e Supabase entram como camadas de produto:
            estrutura, estado, dados, UI e deploy.
          </p>
        </div>

        <div
          className="mouse-reactive relative overflow-hidden border-y border-white/[0.09] py-3 md:py-4 xl:min-h-[760px] xl:py-6"
          data-reveal="soft"
        >
          <div className="technical-map absolute inset-0 opacity-[0.08] xl:opacity-[0.38]" />
          <div className="absolute inset-0 bg-carbon/45 xl:hidden" />
          <div className="absolute left-[38%] top-0 hidden h-full w-px bg-cadmium/55 xl:block" />
          <div className="absolute left-0 right-0 top-[58%] hidden h-px bg-white/[0.14] xl:block" />

          <div className="absolute left-[31%] top-[43%] hidden -translate-x-1/2 -translate-y-1/2 xl:block">
            <p className="max-w-[10rem] text-4xl font-semibold leading-[0.9] text-frost">
              Front-end de produto
            </p>
            <span className="mt-5 block h-px w-36 bg-cadmium" />
          </div>

          {ecosystemNodes.map((node, index) => (
            <div
              key={node.label}
              className={cn(
                "absolute z-20 hidden max-w-[13rem] -translate-x-1/2 -translate-y-1/2 border-l border-white/24 bg-carbon/88 py-4 pl-4 pr-3 backdrop-blur-md xl:block",
                node.size === "lg" && "w-52",
                node.size === "md" && "w-44",
                node.size === "sm" && "w-36",
              )}
              style={{ left: node.x, top: node.y }}
            >
              <span className="font-mono text-xs text-cadmium">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-2xl font-semibold leading-[1.05] text-frost">{node.label}</h3>
              <p className="mt-2 text-[0.95rem] leading-6 text-ash">{node.detail}</p>
            </div>
          ))}

          <div className="relative z-20 grid gap-3 sm:grid-cols-2 xl:hidden">
            {ecosystemNodes.map((node, index) => (
              <div
                key={node.label}
                className="border border-white/[0.11] bg-carbon/78 px-4 py-4 backdrop-blur-md md:min-h-[8.25rem]"
              >
                <span className="font-mono text-xs text-cadmium">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 block text-xl font-semibold leading-[1.05] text-frost">
                  {node.label}
                </span>
                <span className="mt-2 block text-base leading-6 text-ash">{node.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
