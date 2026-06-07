import { siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] py-8">
      <div className="container-shell flex flex-col gap-4 text-sm text-ash/65 md:flex-row md:items-center md:justify-between">
        <p>{siteConfig.name} · Desenvolvedor front-end</p>
        <div className="flex flex-wrap gap-5">
          <a
            className="link-micro"
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="link-micro"
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a className="link-micro" href={`mailto:${siteConfig.email}`}>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
