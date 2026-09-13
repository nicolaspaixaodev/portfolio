import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { idsServicos } from "./data/servicos";

/** Texto nas duas línguas do site. */
const bilingue = z.object({ pt: z.string(), en: z.string() });

/**
 * Cada projeto é um arquivo em src/content/projetos/.
 * Adicionar ou tirar um projeto é criar ou apagar um arquivo;
 * nenhum componente precisa mudar.
 */
const projetos = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/projetos" }),
  schema: ({ image }) =>
    z.object({
      ordem: z.number(),
      /** Face do tambor de serviços da home. */
      categoria: z.enum(idsServicos),
      nome: z.string(),
      ano: z.number(),
      tipo: bilingue,
      funcao: bilingue,
      stack: z.array(z.string()),
      link: z.url(),
      linha: bilingue,
      resumo: bilingue,
      capa: image(),
      capaAlt: bilingue,
      galeria: z.array(
        z.object({
          src: image(),
          formato: z.enum(["desktop", "celular"]),
          alt: bilingue,
          legenda: bilingue.optional(),
        })
      ),
      destaques: z.array(bilingue).default([]),
    }),
});

export const collections = { projetos };
