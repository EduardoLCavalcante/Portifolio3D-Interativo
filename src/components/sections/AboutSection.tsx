import { cn } from "@/lib/cn";

const deliveryCriteria = [
  {
    title: "Leitura",
    description: "A hierarquia precisa guiar o olhar sem depender de explicação.",
  },
  {
    title: "Adaptação",
    description:
      "Mobile, tablet e desktop precisam parecer decisões próprias, não versões espremidas do mesmo layout.",
  },
  {
    title: "Movimento",
    description:
      "A animação precisa orientar o usuário, revelar contexto ou conectar estados.",
  },
  {
    title: "Evolução",
    description:
      "O código precisa permitir ajustes, novas seções e manutenção sem quebrar a experiência.",
  },
];

export function AboutSection() {
  return (
    <section
      id="about"
      className="section-transition section-y border-y border-white/[0.08] bg-carbon/78 backdrop-blur-[1px]"
    >
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr]">
          <p className="font-mono text-sm text-cadmium" data-reveal="soft">
            Critério de entrega
          </p>
          <div>
            <h2
              className="text-balance text-4xl font-semibold leading-[1.02] text-frost md:text-6xl"
              data-reveal="mask"
            >
              <span className="block">
                Uma interface não está pronta quando apenas parece boa.
              </span>
              <span className="mt-4 block text-ash">
                Ela está pronta quando continua clara, responsiva e utilizável fora do cenário
                ideal.
              </span>
            </h2>
          </div>
        </div>

        <div
          className="mt-14 grid border-t border-white/[0.1] text-ash md:grid-cols-2"
          data-reveal="soft"
        >
          {deliveryCriteria.map((criterion, index) => (
            <article
              className={cn(
                "border-b border-white/[0.1] py-7 md:px-8",
                index % 2 === 0 && "md:border-r md:border-white/[0.1] md:pl-0",
                index % 2 === 1 && "md:pr-0",
              )}
              key={criterion.title}
            >
              <h3 className="text-2xl font-semibold leading-tight text-frost">
                {criterion.title}
              </h3>
              <p className="mt-4 max-w-[32rem] text-lg leading-8">{criterion.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
