/**
 * As quatro faces do tambor da home. Cada projeto diz a sua em `categoria`
 * (src/content/projetos/*.md). Face sem projeto suficiente ganha prévias.
 */
export const servicos = [
  {
    id: "criativo",
    nome: "Creative & Immersive",
    foco: {
      pt: "Sites que viram experiência: 3D, WebGL, animação e interações feitas sob medida, fora do padrão da web comum.",
      en: "Websites that feel like an experience: 3D, WebGL, motion and custom interactions that break from the everyday web.",
    },
  },
  {
    id: "ecommerce",
    nome: "E-commerce",
    foco: {
      pt: "Lojas virtuais com design refinado e carregamento rápido, pensadas pra vender, em real ou em dólar.",
      en: "Online stores with refined design and fast loading, built to sell in reais or in dollars.",
    },
  },
  {
    id: "saas",
    nome: "SaaS",
    foco: {
      pt: "Interfaces de aplicações web, painéis e produtos digitais, com foco em usabilidade e numa experiência clara.",
      en: "Interfaces for web apps, dashboards and digital products, focused on usability and a clear experience.",
    },
  },
  {
    id: "landing",
    nome: "Landing Pages",
    foco: {
      pt: "Páginas de lançamento e captação de contatos, com design de impacto e carregamento ultrarrápido.",
      en: "Launch and lead-capture pages with high-impact design and ultra-fast loading.",
    },
  },
] as const;

export type ServicoId = (typeof servicos)[number]["id"];
export const idsServicos = servicos.map((s) => s.id) as [ServicoId, ...ServicoId[]];

/** Mínimo de linhas do tambor, mesmo com poucos projetos. */
export const linhasMinimas = 3;

