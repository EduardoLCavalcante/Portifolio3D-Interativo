import Link from "next/link";
import { navItems, siteConfig } from "@/lib/constants";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-carbon/86 md:bg-carbon/72 md:backdrop-blur-md">
      <nav
        className="container-shell flex h-16 items-center justify-between"
        aria-label="Primary navigation"
      >
        <Link href="#surface" className="group inline-flex items-center gap-3">
          <span className="h-8 w-px rotate-12 bg-cadmium transition-transform duration-300 group-hover:rotate-0" />
          <span className="text-sm font-semibold text-frost">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="link-micro text-sm text-ash/70 transition-colors duration-300 hover:text-frost"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          href={`mailto:${siteConfig.email}`}
          className="magnetic-lite border border-white/14 px-4 py-2 text-sm text-frost transition duration-300 hover:border-cadmium/70 hover:bg-cadmium/12 active:translate-y-px"
        >
          Contato
        </Link>
      </nav>
    </header>
  );
}
