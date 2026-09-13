/**
 * A camada de baixo. Um canvas só, atrás do texto, desenha as imagens da
 * página como planos e a água que aparece embaixo da superfície.
 */
import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import gsap from "gsap";
import { Fluido } from "./fluido";
import { FRAGMENTO_FUNDO, FRAGMENTO_IMAGEM, FRAGMENTO_TITULO, VERTICE_IMAGEM, VERTICE_TELA, VERTICE_TITULO } from "./shaders";
import { estado } from "../estado";
import { criarAbismo } from "./abismo";
import { criarCamadaTextos } from "./textos";
import { FOCO, RAIO, pose } from "../tambor";

type Plano = {
  el: HTMLElement;
  /** Quem controla a animação de entrada; enquanto ela roda, o DOM aparece. */
  ancora: HTMLElement | null;
  img: HTMLImageElement;
  mesh: Mesh;
  material: ShaderMaterial;
  textura: Texture | null;
  eixo: 0 | 1;
  /** Face do tambor da home: gira em 3D dentro do espaço da linha. */
  face: HTMLElement | null;
  espaco: HTMLElement | null;
  pronto: boolean;
  proporcao: number;
};


type Titulo = {
  el: HTMLElement;
  quadro: HTMLCanvasElement;
  textura: CanvasTexture;
  mesh: Mesh;
  material: ShaderMaterial;
  medida: string;
  folga: number;
  pronto: boolean;
};

/** O canvas 2D precisa saber esticar a Anybody; sem isso o nome fica no DOM. */
const canvasEstica = "fontStretch" in CanvasRenderingContext2D.prototype;

export function iniciar() {
  const canvas = document.querySelector<HTMLCanvasElement>(".agua-canvas");
  if (!canvas) return;

  const raiz = document.documentElement;
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
  // Os shaders próprios não passam pela conversão; só os materiais prontos (os peixes) saem em sRGB.
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const cena = new Scene();
  const geometria = new PlaneGeometry(1, 1, 24, 24);
  const camera = new PerspectiveCamera(35, 1, 10, 10000);
  const fluido = new Fluido(renderer);
  // Pra conferir a pincelada numa captura: ?tinta-parada deixa o rastro sem dissipar.
  fluido.congelada = new URLSearchParams(location.search).has("tinta-parada");

  const resolucao = new Vector2();
  const viewport = new Vector2();
  const profundidade = { valor: estado.profundidade };

  // Fundo d'água: um quadro do tamanho da tela desenhado antes das imagens.
  const materialFundo = new ShaderMaterial({
    vertexShader: VERTICE_TELA,
    fragmentShader: FRAGMENTO_FUNDO,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uFluxo: { value: null },
      uTinta: { value: null },
      uResolucao: { value: resolucao },
      uTempo: { value: 0 },
      uProfundidade: { value: profundidade.valor },
      uPonteiro: { value: new Vector2(0.5, 0.5) },
    },
  });
  const fundo = new Mesh(new PlaneGeometry(2, 2), materialFundo);
  fundo.frustumCulled = false;
  fundo.renderOrder = -1;
  cena.add(fundo);

  const abismo = criarAbismo(cena);
  const camadaTextos = criarCamadaTextos(cena, resolucao);

  let planos: Plano[] = [];
  let titulos: Titulo[] = [];
  let ativo = false;

  /* ---------- Tamanho ---------- */

  let largura = 0;
  let altura = 0;
  function medir() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w === largura && h === altura) return;
    largura = w;
    altura = h;
    const dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    resolucao.set(w * dpr, h * dpr);
    viewport.set(w, h);
    camera.aspect = w / h;
    // Com essa distância, 1 unidade do mundo = 1 pixel da tela em z = 0.
    camera.position.z = h / 2 / Math.tan((camera.fov * Math.PI) / 360);
    camera.near = camera.position.z * 0.1;
    camera.far = camera.position.z * 4;
    camera.updateProjectionMatrix();
    fluido.redimensionar(w, h);
    abismo.medir(w, h);
  }
  medir();

  /* ---------- Planos ---------- */

  function criarPlano(el: HTMLElement, img: HTMLImageElement, opcoes: { sempreCor: boolean; eixo: 0 | 1; ancora: HTMLElement | null }): Plano {
    const material = new ShaderMaterial({
      vertexShader: VERTICE_IMAGEM,
      fragmentShader: FRAGMENTO_IMAGEM,
      // Transparente como o fundo, pra entrar na mesma fila e ser desenhado depois dele.
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTextura: { value: null },
        uTinta: { value: null },
        uFluxo: { value: null },
        uResolucao: { value: resolucao },
        uViewport: { value: viewport },
        uEscala: { value: new Vector2(1, 1) },
        uDeslocamento: { value: new Vector2(0, 0) },
        uTempo: { value: 0 },
        uProfundidade: { value: profundidade.valor },
        uSempreCor: { value: opcoes.sempreCor ? 1 : 0 },
        uVelocidade: { value: 0 },
        uEixo: { value: opcoes.eixo },
        uCurva: { value: 0 },
        uSombra: { value: 0 },
        uCorte: { value: 0 },
        uFace: { value: 0 },
        uTamanho: { value: new Vector2(1, 1) },
        uPose: { value: new Vector3() },
        uFoco: { value: 1 },
        uRaio: { value: RAIO },
        uOpacidade: { value: 1 },
      },
    });
    const mesh = new Mesh(geometria, material);
    mesh.visible = false;
    mesh.renderOrder = 1;
    cena.add(mesh);
    const face = el.closest<HTMLElement>(".tambor-face");
    const plano: Plano = {
      el,
      ancora: opcoes.ancora,
      img,
      mesh,
      material,
      textura: null,
      eixo: opcoes.eixo,
      face,
      espaco: face?.closest<HTMLElement>(".tambor") ?? null,
      pronto: false,
      proporcao: 1,
    };

    carregarTextura(plano).catch(() => {});
    return plano;
  }

  /** Escolhe no srcset a versão da imagem que cobre o plano na densidade da tela. */
  function melhorFonte(img: HTMLImageElement, larguraCss: number, alturaCss: number) {
    // Com object-fit: cover, o que manda é o lado que precisa esticar mais.
    const aspecto = (img.naturalWidth || img.width || 16) / (img.naturalHeight || img.height || 10);
    const larguraNecessaria = Math.max(larguraCss, alturaCss * aspecto);
    const alvo = larguraNecessaria * Math.min(window.devicePixelRatio, 1.75) * 1.1;
    const opcoes = (img.srcset || "")
      .split(",")
      .map((parte) => parte.trim().split(/\s+/))
      .map(([url, w]) => ({ url, w: parseInt(w ?? "", 10) }))
      .filter((o) => o.url && o.w)
      .sort((a, b) => a.w - b.w);
    return opcoes.find((o) => o.w >= alvo)?.url ?? opcoes.at(-1)?.url ?? img.currentSrc ?? img.src;
  }

  // Cópias da mesma imagem (o carrossel infinito repete a lista) usam a mesma textura.
  let texturas = new Map<string, Promise<Texture>>();

  async function carregarTextura(plano: Plano) {
    const caixa = plano.el.getBoundingClientRect();
    const url = melhorFonte(plano.img, caixa.width || 600, caixa.height || 375);
    let promessa = texturas.get(url);
    if (!promessa) {
      promessa = (async () => {
        const fonte = new Image();
        fonte.decoding = "async";
        fonte.src = url;
        await fonte.decode();
        const bitmap = await createImageBitmap(fonte, { imageOrientation: "flipY" });
        const textura = new Texture(bitmap);
        textura.flipY = false;
        textura.colorSpace = NoColorSpace;
        // Com mipmaps, a fresta do tambor lê um nível borrado da imagem em vez de texto esmagado.
        textura.minFilter = LinearMipmapLinearFilter;
        textura.magFilter = LinearFilter;
        textura.generateMipmaps = true;
        textura.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        textura.needsUpdate = true;
        return textura;
      })();
      texturas.set(url, promessa);
    }
    const textura = await promessa;
    if (!planos.includes(plano)) return;
    const imagem = textura.image as ImageBitmap;
    plano.textura = textura;
    plano.proporcao = imagem.width / imagem.height;
    plano.material.uniforms.uTextura.value = textura;
    plano.pronto = true;
  }

  /* ---------- Títulos: o nome vira textura pra reagir à pincelada ---------- */

  function criarTitulo(el: HTMLElement): Titulo {
    const quadro = document.createElement("canvas");
    const textura = new CanvasTexture(quadro);
    textura.colorSpace = NoColorSpace;
    textura.minFilter = LinearFilter;
    textura.generateMipmaps = false;
    const material = new ShaderMaterial({
      vertexShader: VERTICE_TITULO,
      fragmentShader: FRAGMENTO_TITULO,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTexto: { value: textura },
        uTinta: { value: null },
        uResolucao: { value: resolucao },
        uFranja: { value: new Vector2() },
        uTempo: { value: 0 },
        uProfundidade: { value: profundidade.valor },
      },
    });
    const mesh = new Mesh(geometria, material);
    mesh.renderOrder = 2;
    mesh.visible = false;
    cena.add(mesh);
    return { el, quadro, textura, mesh, material, medida: "", folga: 0, pronto: false };
  }

  /** Desenha cada letra onde o DOM a colocou. */
  function desenharTitulo(t: Titulo, caixa: DOMRect) {
    const letras = [...t.el.querySelectorAll<HTMLElement>(".letra")];
    if (!letras.length) return false;
    const estilo = getComputedStyle(letras[0]);
    const tamanho = parseFloat(estilo.fontSize);
    const dpr = Math.min(window.devicePixelRatio, 2);
    const folga = Math.ceil(tamanho * 0.3);
    t.folga = folga;
    t.quadro.width = Math.ceil((caixa.width + folga * 2) * dpr);
    t.quadro.height = Math.ceil((caixa.height + folga * 2) * dpr);
    const ctx = t.quadro.getContext("2d");
    if (!ctx) return false;
    ctx.scale(dpr, dpr);
    ctx.font = `${estilo.fontWeight} ${tamanho}px "Anybody Variable", "Anybody", sans-serif`;
    (ctx as CanvasRenderingContext2D & { fontStretch: string }).fontStretch = "extra-expanded";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    const m = ctx.measureText("H");
    const sobe = m.fontBoundingBoxAscent;
    const desce = m.fontBoundingBoxDescent;
    for (const letra of letras) {
      const r = letra.getBoundingClientRect();
      const x = r.left - caixa.left + r.width / 2 + folga;
      const y = r.top - caixa.top + (r.height - (sobe + desce)) / 2 + sobe + folga;
      ctx.fillText((letra.textContent ?? "").toLocaleUpperCase("pt-BR"), x, y);
    }
    t.textura.needsUpdate = true;
    return true;
  }

  function atualizarTitulo(t: Titulo, tempo: number) {
    const letras = t.el.querySelectorAll(".letra");
    const entrando = !t.el.classList.contains("split-pronto") || gsap.getTweensOf(letras).length > 0;
    const caixa = t.el.getBoundingClientRect();
    const fora = caixa.bottom < 0 || caixa.top > altura;
    const usar = ativo && !entrando && !fora && letras.length > 0;

    if (usar) {
      const medida = `${Math.round(caixa.width)}x${Math.round(caixa.height)}@${Math.round(caixa.left)}`;
      if (medida !== t.medida) {
        t.pronto = desenharTitulo(t, caixa);
        t.medida = medida;
      }
    }
    const visivel = usar && t.pronto;
    t.mesh.visible = visivel;
    t.el.classList.toggle("gl-titulo", visivel);
    if (!visivel) return;

    const w = caixa.width + t.folga * 2;
    const h = caixa.height + t.folga * 2;
    t.mesh.position.set(caixa.left - t.folga + w / 2 - largura / 2, altura / 2 - (caixa.top - t.folga + h / 2), 0);
    t.mesh.scale.set(w, h, 1);
    const u = t.material.uniforms;
    (u.uFranja.value as Vector2).set(3 / w, 0);
    u.uTinta.value = fluido.texturaTinta;
    u.uTempo.value = tempo;
    u.uProfundidade.value = profundidade.valor;
  }

  function montar() {
    desmontar();
    // O canvas volta a aparecer quando a página nova já está no lugar.
    gsap.to(canvas, { opacity: 1, duration: 0.5, delay: 0.15, ease: "power2.out", overwrite: true });
    document.querySelectorAll<HTMLElement>("main [data-midia]").forEach((el) => {
      const img = el.querySelector<HTMLImageElement>(".midia-cor");
      if (img) planos.push(criarPlano(el, img, { sempreCor: false, eixo: 0, ancora: el.closest<HTMLElement>("[data-anim]") }));
    });
    document.querySelectorAll<HTMLElement>("main .galeria-quadro").forEach((el) => {
      const img = el.querySelector<HTMLImageElement>("img");
      if (img) planos.push(criarPlano(el, img, { sempreCor: true, eixo: 1, ancora: el.closest<HTMLElement>("[data-anim]") }));
    });
    if (canvasEstica) {
      document
        .querySelectorAll<HTMLElement>('main .display[data-split]:not([data-split="linhas"])')
        .forEach((el) => titulos.push(criarTitulo(el)));
    }
    ativo = true;
    raiz.classList.add("agua-ativa");
  }

  function desmontar() {
    ativo = false;
    camadaTextos.esconder();
    raiz.classList.remove("agua-ativa");
    planos.forEach((p) => {
      p.el.classList.remove("gl-pronto");
      cena.remove(p.mesh);
      p.material.dispose();
    });
    planos = [];
    const antigas = texturas;
    texturas = new Map();
    antigas.forEach((promessa) =>
      promessa.then((t) => {
        (t.image as ImageBitmap | undefined)?.close?.();
        t.dispose();
      }).catch(() => {})
    );
    titulos.forEach((t) => {
      t.el.classList.remove("gl-titulo");
      cena.remove(t.mesh);
      t.material.dispose();
      t.textura.dispose();
    });
    titulos = [];
  }

  /** Enquanto uma animação de entrada mexe no elemento, quem aparece é o DOM. */
  function emAnimacao(p: Plano) {
    const a = p.ancora;
    return Boolean(a && (a.style.opacity || a.style.clipPath || a.style.transform));
  }

  function posicionar(p: Plano) {
    // A face do tambor mede o espaço da linha, que não gira; o giro vem da geometria do tambor.
    const caixa = (p.espaco ?? p.el).getBoundingClientRect();
    const giro = p.face ? pose(estado.faces.get(p.face) ?? 0, caixa.width) : null;
    const fora = caixa.bottom < -50 || caixa.top > altura + 50 || caixa.right < -50 || caixa.left > largura + 50;
    const escondida = giro ? !giro.visivel : false;
    const usar = ativo && p.pronto && !fora && !escondida && !emAnimacao(p) && caixa.width > 1;
    p.mesh.visible = usar;
    const guardaLugar = usar || (p.pronto && ativo && (fora || escondida));
    if (p.el.classList.contains("gl-pronto") !== guardaLugar) p.el.classList.toggle("gl-pronto", guardaLugar);
    if (!usar) return;

    p.mesh.position.set(caixa.left + caixa.width / 2 - largura / 2, altura / 2 - (caixa.top + caixa.height / 2), 0);
    p.mesh.scale.set(caixa.width, caixa.height, 1);
    const un = p.material.uniforms;
    un.uFace.value = giro ? 1 : 0;
    un.uSombra.value = giro?.sombra ?? 0;
    un.uOpacidade.value = giro?.opacidade ?? 1;
    if (giro) {
      (un.uTamanho.value as Vector2).set(caixa.width, caixa.height);
      (un.uPose.value as Vector3).set(giro.x, giro.z, giro.angulo);
      un.uFoco.value = caixa.width * FOCO;
    }

    // object-fit: cover, com a imagem presa no topo nos prints de celular
    const aspectoPlano = caixa.width / caixa.height;
    const aspectoImg = p.proporcao;
    const escala = p.material.uniforms.uEscala.value as Vector2;
    const desloc = p.material.uniforms.uDeslocamento.value as Vector2;
    if (aspectoPlano > aspectoImg) escala.set(1, aspectoImg / aspectoPlano);
    else escala.set(aspectoPlano / aspectoImg, 1);
    // object-position do CSS (em %; "top" = 0%), com o eixo y invertido na textura
    const [px, py] = posicaoDoObjeto(p);
    desloc.set((1 - escala.x) * px, (1 - escala.y) * (1 - py));
  }

  function posicaoDoObjeto(p: Plano): [number, number] {
    if (p.eixo === 1) return [0.5, 0];
    const partes = getComputedStyle(p.img).objectPosition.split(/\s+/);
    const ler = (v: string | undefined, padrao: number) => {
      if (!v) return padrao;
      if (v === "top" || v === "left") return 0;
      if (v === "bottom" || v === "right") return 1;
      if (v === "center") return 0.5;
      return v.endsWith("%") ? parseFloat(v) / 100 : padrao;
    };
    return [ler(partes[0], 0.5), ler(partes[1], 0.5)];
  }

  /* ---------- Ponteiro ---------- */

  // O movimento é acumulado e vira UM respingo por quadro. Mouse de 1000 Hz
  // mandaria dezenas de eventos por quadro e o rastro ficaria enorme.
  let ultimo: { x: number; y: number } | null = null;
  let pendente: { x: number; y: number; dx: number; dy: number } | null = null;
  const ponteiro = new Vector2(0.5, 0.5);
  function mexer(x: number, y: number) {
    abismo.seguir(x - largura / 2, altura / 2 - y);
    ponteiro.set(x / largura, 1 - y / altura);
    if (ultimo) {
      const dx = (x - ultimo.x) / largura;
      const dy = (ultimo.y - y) / altura;
      pendente = pendente ? { x, y, dx: pendente.dx + dx, dy: pendente.dy + dy } : { x, y, dx, dy };
    }
    ultimo = { x, y };
  }
  // Sem mexer por um tempo, a tinta já sumiu: o fluido pode parar de calcular.
  let ultimoRespingo = -Infinity;
  function respingarPendente() {
    if (!pendente) return;
    ultimoRespingo = performance.now();
    const { x, y, dx, dy } = pendente;
    pendente = null;
    const rapidez = Math.hypot(dx, dy);
    // Quanto mais rápido o mouse, mais tinta; parado não rasga nada.
    if (rapidez > 0.0008) fluido.respingar(x / largura, 1 - y / altura, dx, dy, Math.min(0.32, 0.05 + rapidez * 6));
  }
  window.addEventListener("pointermove", (e) => mexer(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) mexer(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener("touchend", () => (ultimo = null), { passive: true });
  document.addEventListener("pointerleave", () => (ultimo = null));

  /* ---------- Profundidade ---------- */

  // A profundidade é contínua e vem do módulo de profundidade (roda do mouse, toque, botões).
  function lerProfundidade() {
    profundidade.valor += (estado.profundidade - profundidade.valor) * 0.18;
    if (Math.abs(estado.profundidade - profundidade.valor) < 0.0005) profundidade.valor = estado.profundidade;
  }

  /* ---------- Quadro ---------- */

  let anterior = performance.now();
  function quadro() {
    if (document.hidden) return;
    const agora = performance.now();
    const dtReal = Math.min((agora - anterior) / 1000, 0.25);
    const dt = Math.min(dtReal, 1 / 30);
    anterior = agora;
    const tempo = agora / 1000;

    medir();
    lerProfundidade();
    respingarPendente();
    if (agora - ultimoRespingo < 3500) fluido.avancar(dt, dtReal);

    materialFundo.uniforms.uFluxo.value = fluido.texturaVelocidade;
    materialFundo.uniforms.uTinta.value = fluido.texturaTinta;
    materialFundo.uniforms.uTempo.value = tempo;
    materialFundo.uniforms.uProfundidade.value = profundidade.valor;
    (materialFundo.uniforms.uPonteiro.value as Vector2).lerp(ponteiro, 0.12);

    // A coluna da home passa por baixo do cabeçalho fixo sem cobrir os links dele.
    const cabecalho = document.querySelector<HTMLElement>("body > header");
    const corte = Math.max(0, (cabecalho?.getBoundingClientRect().bottom ?? 0) + 12) * (resolucao.y / Math.max(1, altura));

    const curva = Math.min(1, Math.max(0, profundidade.valor) * 0.55);
    for (const p of planos) {
      posicionar(p);
      if (!p.mesh.visible) continue;
      const u = p.material.uniforms;
      u.uTinta.value = fluido.texturaTinta;
      u.uFluxo.value = fluido.texturaVelocidade;
      u.uTempo.value = tempo;
      u.uProfundidade.value = profundidade.valor;
      u.uVelocidade.value = p.eixo === 0 ? estado.rolagem : estado.carrossel;
      u.uCurva.value = p.eixo === 1 ? curva : 0;
      u.uCorte.value = p.face ? corte : 0;
    }

    for (const t of titulos) atualizarTitulo(t, tempo);
    const escuro = ativo && (raiz.dataset.depth === "fundo" || raiz.dataset.depth === "abismo");
    camadaTextos.atualizar(fluido.texturaTinta, escuro);
    abismo.atualizar(dtReal, tempo, Math.min(1, Math.max(0, profundidade.valor - 2)));

    renderer.render(cena, camera);
  }
  gsap.ticker.add(quadro);
  window.addEventListener("resize", () => {
    titulos.forEach((t) => (t.medida = ""));
    camadaTextos.invalidar();
  });
  document.fonts?.ready.then(() => {
    titulos.forEach((t) => (t.medida = ""));
    camadaTextos.invalidar();
  });

  /* ---------- Páginas ---------- */

  // Na troca de página o DOM volta a aparecer, pra capa atravessar via View Transitions,
  // e o canvas some pra não deixar o quadro antigo congelado na tela.
  let navegou = false;
  document.addEventListener("astro:before-preparation", () => {
    navegou = true;
    desmontar();
    gsap.set(canvas, { opacity: 0 });
    renderer.clear();
  });
  // Os planos só voltam quando a capa termina de atravessar; antes disso eles
  // apareceriam no destino enquanto a imagem ainda voa.
  document.addEventListener("astro:page-load", () => {
    const transicao = (document as Document & { activeViewTransition?: ViewTransition }).activeViewTransition;
    if (transicao) transicao.finished.finally(montar);
    else if (navegou) window.setTimeout(montar, 1150);
    else montar();
  });
  montar();

  renderer.domElement.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    desmontar();
    gsap.ticker.remove(quadro);
    raiz.classList.add("sem-agua");
  });
}
