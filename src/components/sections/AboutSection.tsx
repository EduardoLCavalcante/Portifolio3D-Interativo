export function AboutSection() {
  return (
    <section
      id="about"
      className="section-transition section-y border-y border-white/[0.08] bg-carbon/78 backdrop-blur-[1px]"
    >
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr]">
          <p className="font-mono text-sm text-cadmium" data-reveal="soft">
            05 / sobre
          </p>
          <div>
            <h2
              className="text-balance text-4xl font-semibold leading-[1] text-frost md:text-6xl"
              data-reveal="mask"
            >
              Construo superfícies front-end onde direção visual, comportamento responsivo
              e código de produção se movem juntos.
            </h2>
          </div>
        </div>

        <div
          className="mt-14 grid gap-8 border-t border-white/[0.1] pt-8 text-lg leading-8 text-ash md:grid-cols-[0.45fr_0.55fr]"
          data-reveal="soft"
        >
          <p>
            Meu foco são interfaces modernas para landing pages, dashboards e produtos digitais
            que precisam ser precisos antes de serem vistosos.
          </p>
          <p>
            Trabalho com React, Next.js, TypeScript, Tailwind CSS e Supabase, com atenção
            a motion, acessibilidade, estabilidade de layout e clareza real de produto.
          </p>
        </div>
      </div>
    </section>
  );
}
