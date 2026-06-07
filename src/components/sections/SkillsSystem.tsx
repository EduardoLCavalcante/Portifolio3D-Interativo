import { skillLayers } from "@/data/skills";

export function SkillsSystem() {
  return (
    <section id="signature" className="section-transition section-y relative overflow-hidden">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-mono text-sm text-cadmium" data-reveal="soft">
              04 / assinatura
            </p>
            <h2
              className="mt-7 text-balance text-5xl font-semibold leading-[0.95] text-frost md:text-7xl"
              data-reveal="mask"
            >
              Design, código e visão de produto compartilham a mesma superfície.
            </h2>
          </div>

          <div className="border-y border-white/[0.1]" data-reveal="soft">
            {skillLayers.map((layer, index) => (
              <article
                className="group relative overflow-hidden border-b border-white/[0.1] py-8 last:border-b-0 md:py-10"
                key={layer.name}
              >
                <div className="absolute bottom-0 left-0 h-px w-20 bg-cadmium transition-all duration-500 group-hover:w-44" />
                <div className="relative z-10 grid gap-8 md:grid-cols-[0.48fr_1.52fr]">
                  <div>
                    <span className="font-mono text-sm text-cadmium">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-5 text-4xl font-semibold leading-none text-frost">
                      {layer.name}
                    </h3>
                  </div>
                  <div>
                    <p className="text-lg leading-8 text-ash">{layer.focus}</p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {layer.items.map((item) => (
                        <div
                          className="border-t border-white/[0.09] pt-3 text-sm text-frost"
                          key={item}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
