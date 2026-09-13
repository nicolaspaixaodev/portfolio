/**
 * Camada de textos em WebGL, só no Fundo e no Abismo.
 * Como no segerman.dev, dentro da pincelada o texto inverte e mostra a superfície:
 * fundo sol, letra em tinta. Os textos do DOM continuam lá (leitura, seleção, links),
 * só com o preenchimento transparente enquanto esta camada os desenha.
 */
import { CanvasTexture, LinearFilter, Mesh, NoColorSpace, PlaneGeometry, ShaderMaterial, Vector2, Vector3, type Scene, type Texture } from "three";

const VERTICE = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENTO = /* glsl */ `
  uniform sampler2D uTextos;
  uniform sampler2D uTinta;
  uniform vec2 uResolucao;
  uniform vec3 uCorTexto;
  uniform vec3 uCorRotulo;
  varying vec2 vUv;

  void main() {
    float rasgo = smoothstep(0.06, 0.11, texture2D(uTinta, vUv).r);

    vec4 t = texture2D(uTextos, vUv);
    vec2 passo = vec2(2.0 / uResolucao.x, 0.0) * (uResolucao.x / 1440.0);
    float aR = texture2D(uTextos, vUv + passo).a;
    float aB = texture2D(uTextos, vUv - passo).a;
    float a = t.a;

    // Canal vermelho = texto normal; verde = rótulo (cor mais apagada).
    float soma = t.r + t.g + 0.0001;
    float wTexto = t.r / soma;
    float wRotulo = t.g / soma;

    vec3 tinta = vec3(0.043, 0.122, 0.141);
    vec3 tintaSuave = vec3(0.290, 0.373, 0.392);
    vec3 fora = uCorTexto * wTexto + uCorRotulo * wRotulo;
    vec3 dentro = tinta * wTexto + tintaSuave * wRotulo;

    float borda = max(aR, aB);
    float alfa = mix(a, max(a, borda), rasgo);
    if (alfa < 0.004) discard;

    vec3 cor = mix(fora, dentro, rasgo);
    // Franja amarela e verde-mar na borda das letras, só dentro da pincelada.
    vec3 franja = vec3(1.0, 0.824, 0.247) * max(aR - a, 0.0) + vec3(0.122, 0.639, 0.588) * max(aB - a, 0.0);
    float pesoFranja = rasgo * clamp((borda - a) / max(alfa, 0.001), 0.0, 1.0);
    cor = mix(cor, franja / max(borda - a, 0.001), pesoFranja);

    gl_FragColor = vec4(cor, alfa);
  }
`;

type Fonte = { sobe: number; desce: number };

const ALTURAS: Record<string, string> = {
  "50%": "ultra-condensed",
  "62.5%": "extra-condensed",
  "75%": "condensed",
  "87.5%": "semi-condensed",
  "100%": "normal",
  "112.5%": "semi-expanded",
  "125%": "expanded",
  "150%": "extra-expanded",
  "200%": "ultra-expanded",
};

function lerCor(css: string, destino: Vector3) {
  const m = css.match(/[\d.]+/g);
  if (m && m.length >= 3) destino.set(+m[0] / 255, +m[1] / 255, +m[2] / 255);
}

export function criarCamadaTextos(cena: Scene, resolucao: Vector2) {
  const quadro = document.createElement("canvas");
  const ctx = quadro.getContext("2d")!;
  const textura = new CanvasTexture(quadro);
  textura.colorSpace = NoColorSpace;
  textura.minFilter = LinearFilter;
  textura.magFilter = LinearFilter;
  textura.generateMipmaps = false;

  const corTexto = new Vector3(0.937, 1, 0.973);
  const corRotulo = new Vector3(0.66, 0.85, 0.82);
  const material = new ShaderMaterial({
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTextos: { value: textura },
      uTinta: { value: null as Texture | null },
      uResolucao: { value: resolucao },
      uCorTexto: { value: corTexto },
      uCorRotulo: { value: corRotulo },
    },
  });
  const malha = new Mesh(new PlaneGeometry(2, 2), material);
  malha.frustumCulled = false;
  malha.renderOrder = 3;
  malha.visible = false;
  cena.add(malha);

  const raiz = document.documentElement;
  const faixa = document.createRange();
  const fontes = new Map<string, Fonte>();
  let assinaturaAnterior = -1;
  let desenhado = false;

  function metricas(fonte: string, esticar: string): Fonte {
    const chave = `${fonte}|${esticar}`;
    let f = fontes.get(chave);
    if (!f) {
      const m = ctx.measureText("Hg");
      f = { sobe: m.fontBoundingBoxAscent, desce: m.fontBoundingBoxDescent };
      fontes.set(chave, f);
    }
    return f;
  }

  function opacidadeDe(el: Element, cache: Map<Element, number>): number {
    const guardada = cache.get(el);
    if (guardada !== undefined) return guardada;
    const pai = el.parentElement;
    const propria = parseFloat(getComputedStyle(el).opacity || "1");
    const valor = pai && pai !== document.body ? propria * opacidadeDe(pai, cache) : propria;
    cache.set(el, valor);
    return valor;
  }

  /** Redesenha se algo mudou (posição, opacidade). Devolve true quando há texto. */
  function desenhar() {
    const largura = window.innerWidth;
    const altura = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const raizes = [document.querySelector("body > header"), document.querySelector("main")].filter(Boolean) as Element[];
    const corDoTexto = getComputedStyle(document.body).color;
    lerCor(corDoTexto, corTexto);
    const exemploRotulo = document.querySelector("main .rotulo, body > header .rotulo");
    if (exemploRotulo) lerCor(getComputedStyle(exemploRotulo).color, corRotulo);

    type Palavra = { texto: string; x: number; y: number; w: number; h: number; fonte: string; esticar: string; espaco: string; alfa: number; rotulo: boolean };
    const palavras: Palavra[] = [];
    const cacheOpacidade = new Map<Element, number>();
    let assinatura = largura * 7 + altura * 13 + dpr * 17;

    for (const r of raizes) {
      const passeio = document.createTreeWalker(r, NodeFilter.SHOW_TEXT);
      let no: Node | null;
      while ((no = passeio.nextNode())) {
        const texto = no as Text;
        if (!texto.data.trim()) continue;
        const el = texto.parentElement;
        if (!el || el.closest(".display[data-split], .acao, svg, .sr-only, .pular")) continue;
        const estilo = getComputedStyle(el);
        if (estilo.visibility === "hidden" || estilo.display === "none") continue;
        const alfa = opacidadeDe(el, cacheOpacidade);
        if (alfa < 0.01) continue;
        const fonte = `${estilo.fontStyle} ${estilo.fontWeight} ${estilo.fontSize} ${estilo.fontFamily}`;
        const esticar = ALTURAS[estilo.fontStretch] ?? "normal";
        const rotulo = estilo.color !== corDoTexto;
        const maiusculas = estilo.textTransform === "uppercase";
        const re = /\S+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(texto.data))) {
          faixa.setStart(texto, m.index);
          faixa.setEnd(texto, m.index + m[0].length);
          const c = faixa.getBoundingClientRect();
          if (c.width < 0.5 || c.bottom < 0 || c.top > altura || c.right < 0 || c.left > largura) continue;
          palavras.push({ texto: maiusculas ? m[0].toUpperCase() : m[0], x: c.left, y: c.top, w: c.width, h: c.height, fonte, esticar, espaco: estilo.letterSpacing, alfa, rotulo });
          assinatura = (assinatura * 31 + Math.round(c.left * 2) * 7 + Math.round(c.top * 2) * 13 + Math.round(alfa * 50) + (rotulo ? 1 : 0)) % 2147483647;
        }
      }
    }

    if (assinatura === assinaturaAnterior && desenhado) return palavras.length > 0;
    assinaturaAnterior = assinatura;

    if (quadro.width !== Math.round(largura * dpr) || quadro.height !== Math.round(altura * dpr)) {
      quadro.width = Math.round(largura * dpr);
      quadro.height = Math.round(altura * dpr);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, quadro.width, quadro.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "lighter";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    for (const p of palavras) {
      ctx.font = p.fonte;
      (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = p.esticar;
      (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = p.espaco === "normal" ? "0px" : p.espaco;
      const { sobe, desce } = metricas(p.fonte, p.esticar);
      const base = p.y + (p.h - (sobe + desce)) / 2 + sobe;
      ctx.fillStyle = p.rotulo ? `rgba(0,255,0,${p.alfa})` : `rgba(255,0,0,${p.alfa})`;
      ctx.fillText(p.texto, p.x, base);
    }
    textura.needsUpdate = true;
    desenhado = true;
    return palavras.length > 0;
  }

  return {
    atualizar(tinta: Texture, ativo: boolean) {
      if (!ativo) {
        if (malha.visible || raiz.classList.contains("gl-textos")) {
          malha.visible = false;
          raiz.classList.remove("gl-textos");
          desenhado = false;
          assinaturaAnterior = -1;
        }
        return;
      }
      const temTexto = desenhar();
      material.uniforms.uTinta.value = tinta;
      malha.visible = temTexto;
      raiz.classList.toggle("gl-textos", temTexto);
    },
    esconder() {
      malha.visible = false;
      raiz.classList.remove("gl-textos");
      desenhado = false;
      assinaturaAnterior = -1;
    },
    invalidar() {
      fontes.clear();
      assinaturaAnterior = -1;
    },
  };
}
