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
    detail: "Componentes reutilizáveis e estados de UI",
    x: "12%",
    y: "23%",
    size: "lg",
  },
  {
    label: "Next.js",
    detail: "Rotas, metadata, renderização e deploy",
    x: "42%",
    y: "12%",
    size: "lg",
  },
  {
    label: "TypeScript",
    detail: "Contratos claros entre dados e interface",
    x: "73%",
    y: "26%",
    size: "md",
  },
  {
    label: "Tailwind CSS",
    detail: "Layout responsivo com tokens consistentes",
    x: "22%",
    y: "62%",
    size: "md",
  },
  {
    label: "Supabase",
    detail: "Auth, dados e integrações rápidas",
    x: "57%",
    y: "55%",
    size: "md",
  },
  {
    label: "Motion",
    detail: "Transições que orientam foco e feedback",
    x: "82%",
    y: "70%",
    size: "sm",
  },
  {
    label: "UI/UX",
    detail: "Hierarquia, legibilidade e fluxo de uso",
    x: "8%",
    y: "78%",
    size: "sm",
  },
  {
    label: "Responsivo",
    detail: "Experiência sólida em mobile e desktop",
    x: "67%",
    y: "83%",
    size: "lg",
  },
];

export const skillLayers = [
  {
    name: "Core Front-end",
    focus: "React, Next.js e TypeScript para componentes, rotas e estados que sustentam produto real.",
    items: ["React", "Next.js", "TypeScript", "Arquitetura de componentes"],
  },
  {
    name: "UI, Styling & Motion",
    focus: "Tailwind, responsividade e motion com propósito para dar clareza, ritmo e acabamento.",
    items: ["Tailwind CSS", "Layouts responsivos", "Microinterações", "Acessibilidade"],
  },
  {
    name: "Produto & Integração",
    focus: "Supabase, formulários, dados e fluxos pensados para conversão, uso recorrente e manutenção.",
    items: ["Supabase", "Dashboards", "Landing pages", "Fluxos de usuário"],
  },
];
