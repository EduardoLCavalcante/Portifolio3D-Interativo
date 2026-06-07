export type EcosystemNode = {
  label: string;
  detail: string;
  x: string;
  y: string;
  size: "sm" | "md" | "lg";
};

export const ecosystemNodes: EcosystemNode[] = [
  {
    label: "React",
    detail: "Sistemas de componentes",
    x: "12%",
    y: "23%",
    size: "lg",
  },
  {
    label: "Next.js",
    detail: "Rotas, metadados, renderização",
    x: "42%",
    y: "12%",
    size: "lg",
  },
  {
    label: "TypeScript",
    detail: "Contratos mais seguros",
    x: "73%",
    y: "26%",
    size: "md",
  },
  {
    label: "Tailwind CSS",
    detail: "Tokens e velocidade de layout",
    x: "22%",
    y: "62%",
    size: "md",
  },
  {
    label: "Supabase",
    detail: "Camada de auth e dados",
    x: "57%",
    y: "55%",
    size: "md",
  },
  {
    label: "Motion",
    detail: "Interação com propósito",
    x: "82%",
    y: "70%",
    size: "sm",
  },
  {
    label: "UI/UX",
    detail: "Hierarquia e visão de produto",
    x: "8%",
    y: "78%",
    size: "sm",
  },
  {
    label: "Responsivo",
    detail: "Superfícies que se adaptam",
    x: "67%",
    y: "83%",
    size: "lg",
  },
];

export const skillLayers = [
  {
    name: "Camada de Interface",
    focus: "Sistemas de design, estados de UI, layouts responsivos e feedback em movimento.",
    items: ["Arquitetura de componentes", "UI com estado", "Acessibilidade", "Microinterações"],
  },
  {
    name: "Camada de Produto",
    focus: "Landing pages, dashboards e fluxos construídos em torno de clareza e intenção.",
    items: ["Páginas de conversão", "Dashboards", "Fluxos de usuário", "Densidade de informação"],
  },
  {
    name: "Camada Técnica",
    focus: "Fundações front-end modernas conectadas a dados reais e necessidades de deploy.",
    items: ["React", "Next.js", "TypeScript", "Supabase"],
  },
];
