export const site = {
  nome: "Nicolas Paixão",
  email: "paixaosantosnicolas@gmail.com",
  /** Código do país + DDD + número, só dígitos. */
  whatsapp: "5579998677780",
  whatsappVisivel: "+55 79 99867-7780",
  ano: 2026,
};

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
