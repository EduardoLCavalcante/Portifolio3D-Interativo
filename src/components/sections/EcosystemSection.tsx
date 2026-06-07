import { ecosystemNodes } from "@/data/skills";
import { cn } from "@/lib/cn";

export function EcosystemSection() {
  return (
    <section id="systems" className="section-transition section-y relative overflow-hidden">
      <div className="container-shell grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="font-mono text-sm text-cadmium" data-reveal="soft">
            02 / sistemas
          </p>
          <h2
            className="mt-7 text-balance text-5xl font-semibold leading-[0.95] text-frost md:text-7xl"
            data-reveal="mask"
          >
            A stack é tratada como estrutura, não decoração.
          </h2>
          <p className="mt-8 max-w-md text-lg leading-8 text-ash" data-reveal="soft">
            Ferramentas num mapa construtivo: cada camada tem função, pressão e limite.
          </p>
        </div>

        <div
          className="mouse-reactive relative min-h-[680px] overflow-hidden border-y border-white/[0.09] py-6 md:min-h-[760px]"
          data-reveal="soft"
        >
          <div className="technical-map absolute inset-0 opacity-[0.38]" />
          <div className="absolute left-[38%] top-0 h-full w-px bg-cadmium/55" />
          <div className="absolute left-0 right-0 top-[58%] h-px bg-white/[0.14]" />

          <div className="absolute left-[31%] top-[43%] hidden -translate-x-1/2 -translate-y-1/2 md:block">
            <p className="max-w-[10rem] text-4xl font-semibold leading-[0.9] text-frost">
              Superfície de interface
            </p>
            <span className="mt-5 block h-px w-36 bg-cadmium" />
          </div>

          {ecosystemNodes.map((node, index) => (
            <div
              key={node.label}
              className={cn(
                "absolute z-20 hidden max-w-[13rem] -translate-x-1/2 -translate-y-1/2 border-l border-white/16 bg-carbon/70 py-3 pl-4 pr-2 backdrop-blur md:block",
                node.size === "lg" && "w-52",
                node.size === "md" && "w-44",
                node.size === "sm" && "w-36",
              )}
              style={{ left: node.x, top: node.y }}
            >
              <span className="font-mono text-xs text-cadmium">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-2xl font-semibold leading-none text-frost">{node.label}</h3>
              <p className="mt-2 text-sm leading-5 text-ash/70">{node.detail}</p>
            </div>
          ))}

          <div className="relative z-20 grid gap-3 md:hidden">
            {ecosystemNodes.map((node) => (
              <div
                key={node.label}
                className="flex items-center justify-between border-b border-white/[0.08] py-4"
              >
                <span className="font-medium text-frost">{node.label}</span>
                <span className="text-right text-sm text-ash/70">{node.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
