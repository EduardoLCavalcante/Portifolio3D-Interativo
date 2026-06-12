"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/client-capabilities";
import { cn } from "@/lib/cn";

const sections = [
  { id: "surface", label: "Início" },
  { id: "behavior", label: "Método" },
  { id: "systems", label: "Stack" },
  { id: "evidence", label: "Projetos" },
  { id: "signature", label: "Entrega" },
  { id: "about", label: "Critério" },
  { id: "contact", label: "Contato" },
];

export function SectionAwareness() {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (prefersReducedMotion()) {
      revealElements.forEach((element) => {
        element.dataset.visible = "true";
      });

      return undefined;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.18,
      },
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index * 22, 180)}ms`);

      // Elements already visible in viewport on load (e.g. above-the-fold hero content)
      // won't re-enter the viewport so the IntersectionObserver never fires for them.
      // Reveal them immediately via getBoundingClientRect so they're never stuck hidden.
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        element.dataset.visible = "true";
      } else {
        revealObserver.observe(element);
      }
    });

    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const sectionElements = sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sectionElements.length) return undefined;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-28% 0px -48% 0px",
        threshold: [0.08, 0.24, 0.42, 0.68],
      },
    );

    sectionElements.forEach((section) => sectionObserver.observe(section));

    return () => sectionObserver.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) {
      return undefined;
    }

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      document.documentElement.style.setProperty("--pointer-x", pointerX.toFixed(3));
      document.documentElement.style.setProperty("--pointer-y", pointerY.toFixed(3));
      frame = 0;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX / window.innerWidth - 0.5;
      pointerY = event.clientY / window.innerHeight - 0.5;

      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <aside className="section-indicator hidden lg:flex" aria-label="Seção atual">
      {sections.map((section, index) => {
        const isActive = activeSection === section.id;

        return (
          <a
            className={cn("section-indicator__item", isActive && "is-active")}
            href={`#${section.id}`}
            key={section.id}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="section-indicator__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="section-indicator__label">{section.label}</span>
          </a>
        );
      })}
    </aside>
  );
}
