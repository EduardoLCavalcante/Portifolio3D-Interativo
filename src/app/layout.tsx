import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CreativeSpotlight } from "@/components/motion/CreativeSpotlight";
import { SectionAwareness } from "@/components/motion/SectionAwareness";
import { Cursor } from "@/components/motion/Cursor";
import { SceneRoot } from "@/components/three/SceneRoot";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { Preloader } from "@/components/ui/Preloader";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Desenvolvedor Front-end`,
  description:
    "Portfólio front-end de Eduardo Cavalcante, com foco em interfaces responsivas, superfícies de produto e experiências digitais com acabamento de nível de produto.",
  metadataBase: new URL(`https://${siteConfig.domain}`),
  keywords: [
    "desenvolvedor front-end",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "landing page",
    "portfólio",
    "interfaces responsivas",
    "Eduardo Cavalcante",
  ],
  authors: [{ name: siteConfig.name, url: `https://${siteConfig.domain}` }],
  creator: siteConfig.name,
  robots: { index: true, follow: true },
  alternates: { canonical: `https://${siteConfig.domain}` },
  openGraph: {
    title: `${siteConfig.name} | Desenvolvedor Front-end`,
    description:
      "Sistemas de interface modernos, arquitetura front-end contemporânea e experiências de produto com direção visual refinada.",
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Desenvolvedor Front-end`,
    description:
      "Interfaces responsivas construídas com React, Next.js, TypeScript, motion e acabamento de produto.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#08090a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Preloader />
        <SmoothScrollProvider>
          <SceneRoot />
          <ScrollProgress />
          <CreativeSpotlight />
          <SectionAwareness />
          <NoiseOverlay />
          <Cursor />
          <Navbar />
          <div className="lg:pl-[var(--sidebar-width)]">
            {children}
            <Footer />
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
