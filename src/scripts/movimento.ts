/**
 * Movimento do site: rolagem suave, entrada e saída das páginas,
 * letras que respondem ao mouse e fotos que ganham cor sob ele.
 * O ritmo é o da água rasa: lento, ondulado, sem pulo nem quique.
 */
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { estado } from "./estado";
import { iniciarProfundidade } from "./profundidade";

gsap.registerPlugin(SplitText);

const raiz = document.documentElement;
const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)");
const AGUA = "expo.out";

raiz.classList.add("movimento-ok");

/** Sem WebGL ou com movimento reduzido: o site fica sem a água. */
let semAgua = false;

/* ---------- Rolagem ---------- */

export const lenis = new Lenis({
  autoRaf: false,
  lerp: 0.085,
  smoothWheel: true,
  prevent: () => false,
});
gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
lenis.on("scroll", ({ velocity }) => (estado.rolagem = velocity));
iniciarProfundidade(lenis);
gsap.ticker.lagSmoothing(0);

/* ---------- Profundidade entre páginas ---------- */

document.addEventListener("astro:after-swap", () => {
  // O roteador troca os atributos do <html>; devolve o estado do site.
  raiz.classList.add("movimento-ok");
  if (!semMovimento.matches) raiz.classList.add("movimento");
  if (semAgua) raiz.classList.add("sem-agua");
  document.querySelectorAll("body > header [data-anim]").forEach((el) => el.classList.add("anim-pronto"));
  // Quem chega voando de outra página (view-transition-name) já nasce visível.
  document.querySelectorAll<HTMLElement>('main [style*="view-transition-name"]').forEach((el) => {
    el.closest("[data-anim]")?.classList.add("anim-pronto", "sem-entrada");
  });
  try {
    const nivel = localStorage.getItem("profundidade");
    if (nivel && ["superficie", "raso", "fundo", "abismo"].includes(nivel)) raiz.dataset.depth = nivel;
  } catch {}
  lenis.resize();
  lenis.scrollTo(0, { immediate: true, force: true });
});

/* ---------- Títulos em letras ---------- */

let divisoes: SplitText[] = [];

function dividir() {
  divisoes.forEach((d) => d.revert());
  divisoes = [];
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const linhas = el.dataset.split === "linhas";
    const divisao = SplitText.create(el, linhas
      ? { type: "lines", mask: "lines", linesClass: "linha" }
      : { type: "words,chars", mask: "chars", wordsClass: "palavra", charsClass: "letra" });
    divisoes.push(divisao);
    el.classList.add("split-pronto");
  });
}

/* ---------- Entrada ---------- */

let primeiraCarga = true;

function entrar() {
  const tl = gsap.timeline({ defaults: { ease: AGUA } });

  const letras = gsap.utils.toArray<HTMLElement>(".letra");
  if (letras.length) {
    tl.fromTo(
      letras,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 1.5,
        // um atraso que ondula, como uma marola passando pelo nome
        stagger: (i) => i * 0.032 + Math.sin(i * 0.85) * 0.025,
      },
      0.1
    );
  }

  const linhas = gsap.utils.toArray<HTMLElement>(".linha");
  if (linhas.length) {
    tl.fromTo(linhas, { yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.07 }, 0.35);
  }

  const escopo = primeiraCarga ? "[data-anim]:not(.sem-entrada)" : "main [data-anim]:not(.sem-entrada)";
  const pecas = gsap.utils.toArray<HTMLElement>(escopo);

  pecas.forEach((peca) => {
    const tipo = peca.dataset.anim;
    const atraso = Number(peca.dataset.atraso ?? 0);
    const inicio = 0.45 + atraso;
    const pronto = () => peca.classList.add("anim-pronto");

    if (tipo === "agua") {
      tl.fromTo(
        peca,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, onStart: pronto, clearProps: "clipPath" },
        inicio
      );
    } else if (tipo === "deslizar") {
      tl.fromTo(
        peca,
        { opacity: 0, x: 80 },
        { opacity: 1, x: 0, duration: 1.4, onStart: pronto, clearProps: "opacity,transform" },
        inicio
      );
    } else {
      tl.fromTo(
        peca,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.1, onStart: pronto, clearProps: "opacity,transform" },
        inicio
      );
    }
  });

  primeiraCarga = false;
  return tl;
}

/* ---------- Saída ---------- */

async function sair() {
  if (semMovimento.matches) return;
  const tl = gsap.timeline({ defaults: { ease: "power3.in" } });
  const letras = gsap.utils.toArray<HTMLElement>(".letra");
  if (letras.length) tl.to(letras, { yPercent: -115, duration: 0.55, stagger: 0.012 }, 0);
  const linhas = gsap.utils.toArray<HTMLElement>(".linha");
  if (linhas.length) tl.to(linhas, { yPercent: -105, duration: 0.5, stagger: 0.03 }, 0);
  const pecas = gsap.utils.toArray<HTMLElement>("main [data-anim]:not([data-manter])");
  if (pecas.length) tl.to(pecas, { opacity: 0, y: -10, duration: 0.4, stagger: 0.02 }, 0);
  await tl;
}

document.addEventListener("astro:before-preparation", (evento) => {
  // A imagem clicada não some: ela atravessa pra próxima página.
  const origem = evento.sourceElement as HTMLElement | undefined;
  origem?.closest?.("[data-anim]")?.setAttribute("data-manter", "");
  const carregar = evento.loader;
  evento.loader = async () => {
    await Promise.all([sair(), carregar()]);
  };
});

/* ---------- Letras que afinam perto do mouse ---------- */

let pararProximidade: (() => void) | undefined;

function proximidade() {
  pararProximidade?.();
  const alvo = document.querySelector<HTMLElement>("[data-proximidade]");
  if (!alvo || !comMouse.matches || semMovimento.matches) return;

  const letras = [...alvo.querySelectorAll<HTMLElement>(".letra")];
  const medidas = letras.map(() => ({ largura: 150, peso: 880 }));
  let mx = -9999;
  let my = -9999;
  let rodando = false;

  const RAIO = 220;

  function quadro() {
    // Com o nome em WebGL, quem reage ao mouse é a pincelada.
    if (alvo!.classList.contains("gl-titulo")) {
      rodando = false;
      return;
    }
    let mexendo = false;
    letras.forEach((letra, i) => {
      const caixa = letra.getBoundingClientRect();
      const dx = mx - (caixa.left + caixa.width / 2);
      const dy = my - (caixa.top + caixa.height / 2);
      const forca = Math.max(0, 1 - Math.hypot(dx, dy) / RAIO) ** 2;
      const largura = 150 - 42 * forca;
      const peso = 880 - 360 * forca;
      const e = medidas[i];
      e.largura += (largura - e.largura) * 0.14;
      e.peso += (peso - e.peso) * 0.14;
      if (Math.abs(largura - e.largura) > 0.2 || Math.abs(peso - e.peso) > 1) mexendo = true;
      letra.style.fontStretch = `${e.largura.toFixed(1)}%`;
      letra.style.fontWeight = String(Math.round(e.peso));
    });
    if (mexendo) requestAnimationFrame(quadro);
    else rodando = false;
  }

  const mover = (evento: PointerEvent) => {
    mx = evento.clientX;
    my = evento.clientY;
    if (!rodando) {
      rodando = true;
      requestAnimationFrame(quadro);
    }
  };
  const sairJanela = () => {
    mx = -9999;
    my = -9999;
    if (!rodando) {
      rodando = true;
      requestAnimationFrame(quadro);
    }
  };

  window.addEventListener("pointermove", mover, { passive: true });
  document.addEventListener("pointerleave", sairJanela);
  pararProximidade = () => {
    window.removeEventListener("pointermove", mover);
    document.removeEventListener("pointerleave", sairJanela);
    letras.forEach((letra) => {
      letra.style.fontStretch = "";
      letra.style.fontWeight = "";
    });
  };
}

/* ---------- Cor sob o mouse ---------- */

let pararMidias: (() => void) | undefined;

function midias() {
  pararMidias?.();
  const lista = [...document.querySelectorAll<HTMLElement>("[data-midia]")];
  const limpezas: (() => void)[] = [];

  if (comMouse.matches) {
    lista.forEach((midia) => {
      const mover = (evento: PointerEvent) => {
        const caixa = midia.getBoundingClientRect();
        gsap.to(midia, {
          "--mx": `${evento.clientX - caixa.left}px`,
          "--my": `${evento.clientY - caixa.top}px`,
          duration: 0.9,
          ease: "power3.out",
          overwrite: false,
        });
      };
      const entrarMidia = (evento: PointerEvent) => {
        const caixa = midia.getBoundingClientRect();
        gsap.set(midia, { "--mx": `${evento.clientX - caixa.left}px`, "--my": `${evento.clientY - caixa.top}px` });
        gsap.to(midia, { "--r": `${Math.max(caixa.width, caixa.height) * 0.42}px`, duration: 1.4, ease: AGUA, overwrite: "auto" });
      };
      const sairMidia = () => {
        gsap.to(midia, { "--r": "0px", duration: 1.1, ease: "power2.out", overwrite: "auto" });
      };

      midia.addEventListener("pointermove", mover);
      midia.addEventListener("pointerenter", entrarMidia);
      midia.addEventListener("pointerleave", sairMidia);
      limpezas.push(() => {
        midia.removeEventListener("pointermove", mover);
        midia.removeEventListener("pointerenter", entrarMidia);
        midia.removeEventListener("pointerleave", sairMidia);
      });
    });
  } else {
    const observador = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.target.classList.toggle("na-agua", e.intersectionRatio > 0.55)),
      { threshold: [0, 0.55, 1] }
    );
    lista.forEach((midia) => observador.observe(midia));
    limpezas.push(() => observador.disconnect());
  }

  pararMidias = () => limpezas.forEach((f) => f());
}

/* ---------- Ciclo das páginas ---------- */

/* ---------- A camada de baixo (WebGL) ---------- */

let aguaPedida = false;
function temWebGL2() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

function pedirAgua() {
  if (aguaPedida) return;
  if (semMovimento.matches || !temWebGL2()) {
    semAgua = true;
    raiz.classList.add("sem-agua");
    return;
  }
  aguaPedida = true;
  // Carrega depois da camada clara: ninguém espera a água pra ver o site.
  let carregado = false;
  const carregar = () => {
    if (carregado) return;
    carregado = true;
    import("./agua").then((m) => m.iniciar()).catch(() => raiz.classList.add("sem-agua"));
  };
  if (!comMouse.matches) {
    // No celular, a água só acorda no primeiro toque ou rolagem (ou depois de uns segundos),
    // pra não disputar o processador com o carregamento da página.
    const acordar = () => {
      ["pointerdown", "touchstart", "wheel", "scroll", "keydown"].forEach((ev) => window.removeEventListener(ev, acordar));
      carregar();
    };
    ["pointerdown", "touchstart", "wheel", "scroll", "keydown"].forEach((ev) => window.addEventListener(ev, acordar, { passive: true, once: true }));
    window.setTimeout(acordar, 6000);
  } else if ("requestIdleCallback" in window) {
    requestIdleCallback(carregar, { timeout: 1500 });
  } else {
    setTimeout(carregar, 400);
  }
}

document.addEventListener("astro:page-load", () => {
  pedirAgua();
  dividir();
  if (semMovimento.matches) {
    document.querySelectorAll("[data-anim]").forEach((el) => el.classList.add("anim-pronto"));
  } else {
    entrar();
  }
  proximidade();
  midias();
  lenis.resize();
});

document.addEventListener("astro:before-swap", () => {
  pararProximidade?.();
  pararMidias?.();
});
