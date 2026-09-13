import type { ImageMetadata } from "astro";

/**
 * Conteúdo da página Sobre.
 *
 * RASCUNHO: o texto ainda vai ser escrito junto com o Nicolas.
 * Para colocar uma foto, importe o arquivo de src/assets/sobre/ e
 * preencha `foto` e `fotoAlt`. Sem foto, a página se reorganiza sozinha.
 */
export const sobre: {
  foto?: ImageMetadata;
  fotoAlt?: { pt: string; en: string };
  paragrafos: { pt: string[]; en: string[] };
  ferramentas: string[];
  formacao: { pt: string[]; en: string[] };
} = {
  foto: undefined,
  fotoAlt: undefined,
  paragrafos: {
    pt: [
      "Sou o Nicolas, creative developer em Aracaju. Faço sites que se mexem, carregam rápido e funcionam de verdade, do cardápio que fecha pedido no WhatsApp ao painel onde a casa acompanha tudo.",
      "Estou terminando o técnico em Edificações no IFS e sigo para Ciência da Computação. Da obra eu trouxe o hábito de medir antes de cortar: entender o problema do negócio antes de desenhar a primeira tela.",
      "Se você tem um negócio e quer um site que o seu cliente usa, e não só olha, me chama.",
    ],
    en: [
      "I'm Nicolas, a creative developer in Aracaju, Brazil. I build websites that move, load fast and actually work, from a menu that closes orders on WhatsApp to the dashboard where the restaurant keeps track of it all.",
      "I'm finishing a technical degree in Building Construction at IFS and heading into Computer Science. The job site taught me to measure twice and cut once: understand the business problem before drawing the first screen.",
      "If you run a business and want a website your customers actually use, not just look at, get in touch.",
    ],
  },
  ferramentas: ["HTML, CSS, JavaScript", "TypeScript, React, Astro", "Tailwind, Supabase, Vercel"],
  formacao: {
    pt: ["Técnico em Edificações, IFS, 2026", "Ciência da Computação, próximo passo"],
    en: ["Building Construction technician, IFS, 2026", "Computer Science, next step"],
  },
};
