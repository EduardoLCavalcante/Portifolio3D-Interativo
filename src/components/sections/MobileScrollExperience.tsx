import { scrollSteps } from "@/data/scroll-steps";

export function MobileScrollExperience() {
  return (
    <section className="border-y border-white/[0.08] bg-[#090909] py-16 md:hidden">
      <div className="container-shell">
        <p className="font-mono text-sm text-cadmium" data-reveal="soft">
          01 / comportamento
        </p>
        <h2
          className="mt-7 text-balance text-4xl font-semibold leading-[0.98] text-frost"
          data-reveal="mask"
        >
          Lógica de interface sem sequestrar o scroll.
        </h2>
        <p className="mt-6 text-base leading-7 text-ash" data-reveal="soft">
          A experiência desktop vira uma sequência legível no mobile: sem pinning, sem scrub,
          sem camada de vídeo sobre o conteúdo.
        </p>

        <div
          className="mobile-scroll-poster mt-10 aspect-[4/3] overflow-hidden border-y border-white/[0.1] p-4"
          data-reveal="soft"
        >
          <div className="grid h-full grid-cols-6 grid-rows-5 gap-3">
            <div className="col-span-4 row-span-1 border border-white/14 bg-white/[0.055]" />
            <div className="col-span-2 row-span-3 border border-cadmium/22 bg-cadmium/10" />
            <div className="col-span-3 row-span-1 border border-white/12 bg-white/[0.04]" />
            <div className="col-span-1 row-span-3 border-l border-cadmium/55" />
            <div className="col-span-5 row-span-2 border border-white/12 bg-white/[0.035]" />
          </div>
        </div>

        <div className="mt-10 divide-y divide-white/[0.08]">
          {scrollSteps.map((step, index) => (
            <article className="py-7" key={step.title} data-reveal="soft">
              <p className="font-mono text-xs text-cadmium">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-3xl font-semibold leading-none text-frost">
                {step.title}
              </h3>
              <p className="mt-5 text-base leading-7 text-ash">{step.copy}</p>
            </article>
          ))}
        </div>

        <a
          className="mt-8 inline-flex h-12 items-center justify-center border border-white/14 px-5 text-sm text-frost transition duration-300 active:translate-y-px"
          href="#evidence"
        >
          Ver projetos
        </a>
      </div>
    </section>
  );
}
