import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { rotas } from "../i18n/ui";

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://nicolaspaixao.com.br");
  const projetos = await getCollection("projetos");
  const pares = [rotas.inicio, rotas.sobre, ...projetos.map((p) => rotas.projeto(p.id))];

  const url = (caminho: string) => new URL(caminho, base).href;
  const entradas = pares
    .flatMap((par) =>
      (["pt", "en"] as const).map(
        (lang) => `  <url>
    <loc>${url(par[lang])}</loc>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${url(par.pt)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${url(par.en)}" />
  </url>`
      )
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entradas}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
