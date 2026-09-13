/**
 * Profundidade contínua: de 0 (superfície) a 2 (fundo).
 * A roda do mouse ou o toque descem quando a página não tem mais pra onde rolar.
 * Com a água em WebGL, a descida é contínua; sem ela, cada gesto troca um nível.
 */
import gsap from "gsap";
import type Lenis from "lenis";
import { estado } from "./estado";

const NIVEIS = ["superficie", "raso", "fundo", "abismo"] as const;
const raiz = document.documentElement;
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
const PIXELS_POR_NIVEL = 900;

const limitar = (v: number) => Math.min(3, Math.max(0, v));
const temaDo = (d: number) => (d < 1 ? "superficie" : d < 1.5 ? "raso" : d < 2.5 ? "fundo" : "abismo");
const nomeMaisPerto = (d: number) => NIVEIS[Math.round(limitar(d))];
const continuo = () => raiz.classList.contains("agua-ativa");

let livre = estado.profundidade;
let assentar = 0;
let origemGesto: number | null = null;

function aplicarTema() {
  raiz.classList.toggle("descendo", estado.profundidade > 0.01 && estado.profundidade < 0.999);
  if (raiz.dataset.mare) return;
  const tema = temaDo(estado.profundidade);
  if (raiz.dataset.depth !== tema) {
    raiz.dataset.depth = tema;
    document.dispatchEvent(new CustomEvent("profundidade:tema"));
  }
}

function salvar() {
  const nome = nomeMaisPerto(estado.profundidade);
  try {
    localStorage.setItem("profundidade", nome);
  } catch {}
  const url = new URL(location.href);
  if (url.searchParams.has("profundidade")) {
    url.searchParams.set("profundidade", nome);
    history.replaceState(history.state, "", url);
  }
}

/** Vai até um nível (0, 1 ou 2), com a água subindo ou baixando. */
export function irPara(nivel: number, duracao = 2.2) {
  livre = limitar(nivel);
  gsap.to(estado, {
    profundidade: livre,
    duration: duracao,
    ease: "power2.inOut",
    overwrite: true,
    onUpdate: aplicarTema,
    onComplete: () => {
      aplicarTema();
      salvar();
    },
  });
}

export function iniciarProfundidade(lenis: Lenis) {
  const inicial = Math.max(0, NIVEIS.indexOf((raiz.dataset.depth ?? "superficie") as (typeof NIVEIS)[number]));
  estado.profundidade = inicial;
  livre = inicial;

  // Os botões do cabeçalho pedem um nível.
  document.addEventListener("profundidade:ir", (e) => irPara((e as CustomEvent<number>).detail));

  // Troca de página: o nível salvo volta a valer.
  document.addEventListener("astro:after-swap", () => {
    const i = NIVEIS.indexOf((raiz.dataset.depth ?? "superficie") as (typeof NIVEIS)[number]);
    if (i >= 0 && Math.round(estado.profundidade) !== i) {
      gsap.killTweensOf(estado);
      estado.profundidade = i;
      livre = i;
    }
  });

  let acumulado = 0;
  let esperaDegrau = 0;

  lenis.on("virtual-scroll", ({ deltaY, event }) => {
    if (semMovimento.matches || !deltaY) return;
    const noFim = lenis.scroll >= lenis.limit - 2;
    const noTopo = lenis.scroll <= 1;
    // Enquanto a página ainda rola, a rolagem é da página.
    if ((deltaY > 0 && !noFim) || (deltaY < 0 && !noTopo)) return;
    // O carrossel da página anda primeiro; a água só desce quando ele acaba.
    if (estado.consumirRolagem?.(deltaY)) return;

    if (continuo()) {
      if (origemGesto === null) origemGesto = Math.round(estado.profundidade);
      livre = limitar(livre + deltaY / PIXELS_POR_NIVEL);
      gsap.to(estado, { profundidade: livre, duration: 1.1, ease: "power3.out", overwrite: true, onUpdate: aplicarTema });
      window.clearTimeout(assentar);
      // Parou de rolar: a água assenta no nível mais perto.
      // Um empurrão de 20% de nível já basta pra seguir na direção do gesto.
      assentar = window.setTimeout(() => {
        const diferenca = livre - (origemGesto ?? livre);
        const destino = diferenca > 0.2 ? Math.ceil(livre - 0.001) : diferenca < -0.2 ? Math.floor(livre + 0.001) : Math.round(livre);
        origemGesto = null;
        irPara(destino, 1.6);
      }, 650);
      return;
    }

    // Sem WebGL: um nível por gesto, com a transição de View Transitions.
    acumulado += deltaY;
    window.clearTimeout(esperaDegrau);
    esperaDegrau = window.setTimeout(() => (acumulado = 0), 400);
    if (Math.abs(acumulado) < 260) return;
    const atual = NIVEIS.indexOf((raiz.dataset.depth ?? "superficie") as (typeof NIVEIS)[number]);
    const proximo = Math.min(3, Math.max(0, atual + Math.sign(acumulado)));
    acumulado = -Math.sign(acumulado) * 2000; // trava até o gesto acabar
    if (proximo !== atual) {
      document.querySelector<HTMLButtonElement>(`.profundidade-nivel[data-nivel="${NIVEIS[proximo]}"]`)?.click();
    }
  });
}
