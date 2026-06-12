import { projectsFallback } from "@/data/projects-fallback";

type GithubApiRepo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  disabled: boolean;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  created_at: string;
  pushed_at: string | null;
};

export type GithubRepo = {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  updatedLabel: string;
  createdAt: string;
  url: string;
  homepage: string | null;
  source: "github" | "fallback";
};

export type GithubProjectsResult = {
  repos: GithubRepo[];
  source: "github" | "fallback";
  error?: string;
};

const stackLanguages = new Set(["TypeScript", "JavaScript", "CSS", "HTML"]);

const projectDescriptions: Record<string, string> = {
  "Portifolio3D-Interativo":
    "Portfólio 3D em Next.js, TypeScript, Three.js, GSAP e Motion. Prova domínio de UI premium, scroll narrativo, WebGL e responsividade.",
  dlicesorvetes:
    "E-commerce responsivo para marca de sorvetes em Next.js, com catálogo, carrinho, checkout e Supabase. Prova execução comercial com fluxo real.",
  "MaisVidaAcademia-LP":
    "Landing page em React, Vite, TypeScript e Tailwind para academia, com planos, agenda, conteúdo comercial e contato. Prova foco em conversão local.",
  "web-amo":
    "Plataforma acadêmica em Next.js 16, React 19 e TypeScript, com cadastro, autenticação e UI responsiva. Prova organização de produto e formulários.",
  automatizacao_fies_med:
    "Automação Python com Selenium para coletar dados do FIES Medicina, persistindo CSV e tratando CAPTCHA, timeouts e DOM instável. Prova robustez fora do front-end.",
  arenasync:
    "SaaS de agendamento para arenas esportivas em React, Vite, Tailwind, Zustand e Recharts, com perfis de acesso, dashboards e booking.",
  portifolio_Jose:
    "Portfólio em React, TypeScript e Tailwind com dark mode e composição editorial. Prova direção visual aplicada a presença profissional.",
  "poker-buddy":
    "Aplicativo de poker em React, TypeScript e Vite, com clock de torneio, cash game, histórico e configurações. Prova produto interativo com estado local.",
  dbscan_manual:
    "Implementação manual do DBSCAN em Python, com classificação de pontos, datasets Two Moons, Two Circles e Iris, além de visualizações. Prova base algorítmica.",
  mundo_dos_blocos_IA:
    "Planejador automático em Python para Mundo dos Blocos com STRIPS, BFS, IDS, A* e métricas de execução. Prova base de IA clássica.",
  landing_AprovaUFC:
    "Landing page em React, TypeScript, Tailwind e Motion para o Aprova UFC, com apresentação institucional e CTA para Instagram.",
};

const formatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(value: string) {
  return formatter.format(new Date(value));
}

function mapRepo(repo: GithubApiRepo): GithubRepo {
  const publicDescription = repo.description?.trim() || projectDescriptions[repo.name] || null;

  return {
    id: repo.id,
    name: repo.name,
    description: publicDescription,
    language: repo.language,
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    updatedLabel: formatDate(repo.updated_at),
    createdAt: repo.created_at,
    url: repo.html_url,
    homepage: repo.homepage?.trim() || null,
    source: "github",
  };
}

function getRepoScore(repo: GithubRepo) {
  const updatedTime = new Date(repo.updatedAt).getTime();
  const daysSinceUpdate = Number.isFinite(updatedTime)
    ? Math.max(0, (Date.now() - updatedTime) / 86_400_000)
    : 365;
  const recency = Math.max(0, 365 - daysSinceUpdate);
  const hasDescription = repo.description?.trim() ? 350 : 0;
  const hasLive = repo.homepage ? 600 : 0;
  const stackMatch = repo.language && stackLanguages.has(repo.language) ? 450 : 0;

  return hasDescription + hasLive + stackMatch + repo.stars * 1000 + recency;
}

function sortRepos(repos: GithubRepo[]) {
  return [...repos].sort((a, b) => getRepoScore(b) - getRepoScore(a));
}

function fallbackResult(error?: string): GithubProjectsResult {
  return {
    repos: sortRepos(projectsFallback),
    source: "fallback",
    error,
  };
}

export async function getPublicGithubRepos(username: string): Promise<GithubProjectsResult> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "eduardo-cavalcante-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers,
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      return fallbackResult(`GitHub respondeu com status ${response.status}`);
    }

    const repos = (await response.json()) as GithubApiRepo[];
    const projectRepos = repos
      .filter((repo) => !repo.fork && !repo.archived && !repo.disabled)
      .filter((repo) => repo.name.toLowerCase() !== username.toLowerCase())
      .map(mapRepo);

    if (projectRepos.length === 0) {
      return fallbackResult("GitHub não retornou repositórios de projeto");
    }

    return {
      repos: sortRepos(projectRepos),
      source: "github",
    };
  } catch (error) {
    return fallbackResult(error instanceof Error ? error.message : "Falha na consulta ao GitHub");
  }
}
