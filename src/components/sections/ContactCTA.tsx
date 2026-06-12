import { MagneticButton } from "@/components/motion/MagneticButton";
import { siteConfig } from "@/lib/constants";

export function ContactCTA() {
  return (
    <section id="contact" className="section-transition section-y relative isolate overflow-hidden">
      <div className="contact-copy-scrim" aria-hidden="true" />
      <div className="mouse-reactive absolute inset-y-0 left-[18%] -z-10 w-px bg-white/[0.08]" />
      <div className="mouse-reactive absolute inset-y-0 right-[22%] -z-10 w-px bg-cadmium/22" />
      <div className="container-shell">
        <div className="border-y border-white/[0.1] py-10 md:py-14">
          <div className="contact-emerge">
            <p className="font-mono text-sm text-cadmium" data-reveal="soft">
              Projeto novo
            </p>
            <div className="mt-8 grid gap-10 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
              <div>
                <h2
                  className="text-balance text-5xl font-semibold leading-[0.92] text-frost md:text-7xl lg:text-8xl"
                  data-reveal="mask"
                >
                  Tem uma interface, landing page ou dashboard para construir?
                </h2>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-ash" data-reveal="soft">
                  Eu ajudo a transformar requisitos em front-end responsivo, com React/Next.js,
                  motion com função e acabamento pronto para uso real.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:items-start" data-reveal="soft">
                <MagneticButton href={`mailto:${siteConfig.email}`} className="w-full sm:w-auto">
                  Discutir projeto
                </MagneticButton>
                <MagneticButton
                  href={siteConfig.social.github}
                  variant="secondary"
                  external
                  className="w-full sm:w-auto"
                >
                  Ver GitHub
                </MagneticButton>
              </div>
            </div>

            <div
              className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/[0.08] pt-6 text-sm text-ash/70"
              data-reveal="soft"
            >
              <a
                className="link-micro hover:text-frost"
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="link-micro hover:text-frost"
                href={siteConfig.social.currentPortfolio}
                target="_blank"
                rel="noreferrer"
              >
                {siteConfig.domain}
              </a>
              <a className="link-micro hover:text-frost" href={`mailto:${siteConfig.email}`}>
                {siteConfig.contactEmailDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
