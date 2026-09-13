/**
 * O abismo: um atum que persegue o mouse com o nariz na frente, tubarões que
 * cruzam a névoa ao fundo e uma luz fria que acompanha o cursor.
 *
 * Modelos: "Tuna Fish" (GoldenZtuff) e "Shark" (Optic Idealist), via Fab,
 * otimizados com gltf-transform (meshopt + texturas webp 1024).
 * Só carregam quando o abismo é aberto pela primeira vez.
 */
import {
  AmbientLight,
  AnimationMixer,
  Box3,
  Color,
  DirectionalLight,
  Fog,
  Group,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PointLight,
  Vector3,
  type AnimationClip,
  type Material,
  type Mesh,
  type Object3D,
  type Scene,
} from "three";

const COR_ABISMO = new Color("#04151b");

type Modelo = { cena: Group; clipes: AnimationClip[] };

type Tubarao = {
  raiz: Group;
  mixer: AnimationMixer;
  direcao: 1 | -1;
  velocidade: number;
  espera: number;
  y: number;
  fase: number;
};

type Atum = {
  raiz: Group;
  mixer: AnimationMixer;
  posicao: Vector3;
  /** 0 = nariz pra direita, π = pra esquerda; π/2 = de frente pra câmera, no meio da curva. */
  yaw: number;
  pitch: number;
  velocidade: number;
  ladoAlvo: 1 | -1;
  rolagem: number;
  meioComprimento: number;
};

/**
 * Põe o modelo num suporte com nariz em +X e dorso em +Y, centralizado e no comprimento pedido.
 * `orientar` aplica a rotação específica de cada arquivo.
 */
function montarSuporte(modelo: Object3D, comprimento: number, orientar: (g: Group) => void) {
  const girado = new Group();
  girado.add(modelo);
  orientar(girado);
  const centrado = new Group();
  centrado.add(girado);
  centrado.updateMatrixWorld(true);
  const caixa = new Box3().setFromObject(centrado, true);
  const tamanho = caixa.getSize(new Vector3());
  girado.position.sub(caixa.getCenter(new Vector3()));
  const suporte = new Group();
  suporte.scale.setScalar(comprimento / Math.max(tamanho.x, 0.0001));
  suporte.add(centrado);
  modelo.traverse((o) => {
    const malha = o as Mesh;
    if (!malha.isMesh) return;
    malha.frustumCulled = false; // a animação do esqueleto não atualiza a caixa de recorte
    const materiais = (Array.isArray(malha.material) ? malha.material : [malha.material]) as Material[];
    materiais.forEach((m) => {
      m.transparent = true;
      (m as Material & { fog?: boolean }).fog = true;
    });
  });
  return suporte;
}

function definirOpacidade(o: Object3D, opacidade: number) {
  o.traverse((filho) => {
    const malha = filho as Mesh;
    if (!malha.isMesh) return;
    const materiais = (Array.isArray(malha.material) ? malha.material : [malha.material]) as Material[];
    materiais.forEach((m) => {
      m.opacity = opacidade;
      m.depthWrite = opacidade > 0.98;
    });
  });
}

/**
 * O atum não é pra parecer um atum de verdade: vira uma forma verde-mar do site,
 * com o desenho da pele só insinuado, contorno de luz fria e olho escuro.
 */
function estilizarAtum(modelo: Object3D) {
  modelo.traverse((o) => {
    const malha = o as Mesh;
    if (!malha.isMesh) return;
    const original = malha.material as MeshStandardMaterial;
    const nome = original.name ?? "";
    if (nome.includes(".004")) {
      malha.visible = false; // córnea: o brilho do olho de verdade
      return;
    }
    if (nome.includes(".003")) {
      malha.material = new MeshBasicMaterial({ color: new Color("#06181c") });
      return;
    }
    const corpo = new MeshStandardMaterial({
      color: new Color("#3b8a8d"),
      map: original.map,
      roughness: 1,
      metalness: 0,
      emissive: new Color("#0b2f33"),
    });
    corpo.customProgramCacheKey = () => "atum-estilizado";
    corpo.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <map_fragment>",
          `#ifdef USE_MAP
            float luz = dot(texture2D(map, vMapUv).rgb, vec3(0.299, 0.587, 0.114));
            diffuseColor.rgb *= mix(0.62, 1.12, smoothstep(0.05, 0.85, luz));
          #endif`
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          float borda = pow(1.0 - clamp(abs(dot(normal, normalize(vViewPosition))), 0.0, 1.0), 2.4);
          totalEmissiveRadiance += vec3(0.62, 1.0, 0.9) * borda * 0.55;`
        );
    };
    malha.material = corpo;
  });
}

export function criarAbismo(cena: Scene) {
  const nevoa = new Fog(COR_ABISMO, 1000, 3400);
  const grupo = new Group();
  grupo.visible = false;
  cena.add(grupo);

  const ambiente = new AmbientLight(new Color("#5fb3bb"), 0);
  const deCima = new DirectionalLight(new Color("#bff3ea"), 0);
  deCima.position.set(0.3, 1, 0.6);
  // A luz fria do cursor: ilumina o atum quando ele chega perto.
  const lanterna = new PointLight(new Color("#9fffe6"), 0, 520, 0);
  grupo.add(ambiente, deCima, lanterna);

  let largura = 1;
  let altura = 1;
  const cursor = new Vector3(0, 0, 60);
  let temCursor = false;

  let tubaroes: Tubarao[] = [];
  let atum: Atum | null = null;
  let carregando = false;

  function reposicionar(t: Tubarao) {
    t.direcao = Math.random() < 0.5 ? 1 : -1;
    t.velocidade = 95 + Math.random() * 55;
    t.y = (Math.random() - 0.5) * altura * 0.55;
    const margem = largura * 1.1 + 900;
    t.raiz.position.set(-t.direcao * margem, t.y, -900 - Math.random() * 900);
    t.raiz.rotation.y = t.direcao === 1 ? 0 : Math.PI;
    t.espera = 3 + Math.random() * 8;
  }

  async function carregar() {
    carregando = true;
    try {
      const [{ GLTFLoader }, { MeshoptDecoder }, { clone }] = await Promise.all([
        import("three/addons/loaders/GLTFLoader.js"),
        import("three/addons/libs/meshopt_decoder.module.js"),
        import("three/addons/utils/SkeletonUtils.js"),
      ]);
      const carregador = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      const ler = (url: string): Promise<Modelo> => carregador.loadAsync(url).then((g) => ({ cena: g.scene, clipes: g.animations }));
      const [modeloTubarao, modeloAtum] = await Promise.all([ler("/modelos/tubarao.glb"), ler("/modelos/atum.glb")]);

      // Tubarão: no arquivo, nariz em -X e dorso em +Y (conferido de perto; as peitorais abrem em Z).
      // Tom puxado pro verde-mar do site, pra conversar com o atum estilizado.
      modeloTubarao.cena.traverse((o) => {
        const malha = o as Mesh;
        if (malha.isMesh) (malha.material as MeshStandardMaterial).color?.set("#8fb3b1");
      });
      tubaroes = [0, 1].map((i) => {
        const copia = clone(modeloTubarao.cena) as Group;
        const raiz = new Group();
        raiz.add(montarSuporte(copia, 520, (g) => (g.rotation.y = Math.PI)));
        const mixer = new AnimationMixer(copia);
        if (modeloTubarao.clipes[0]) mixer.clipAction(modeloTubarao.clipes[0]).play();
        mixer.setTime(i * 1.7);
        grupo.add(raiz);
        const t: Tubarao = { raiz, mixer, direcao: 1, velocidade: 70, espera: 0, y: 0, fase: i * 2 };
        reposicionar(t);
        t.espera = 1 + i * 7;
        return t;
      });

      // Atum: no arquivo, nariz em +Z e dorso em +Y. Visual estilizado, não realista.
      estilizarAtum(modeloAtum.cena);
      // Como os tubarões, o atum mora no fundo: fica atrás dos prints (renderOrder 1) e do texto,
      // pra nunca tapar o trabalho. Pedido do Nicolas em 13/09/2026.
      const raiz = new Group();
      raiz.add(montarSuporte(modeloAtum.cena, 170, (g) => (g.rotation.y = Math.PI / 2)));
      const mixer = new AnimationMixer(modeloAtum.cena);
      if (modeloAtum.clipes[0]) mixer.clipAction(modeloAtum.clipes[0]).play();
      grupo.add(raiz);
      atum = {
        raiz,
        mixer,
        posicao: new Vector3(-largura * 0.6, -altura * 0.15, 60),
        yaw: 0,
        pitch: 0,
        velocidade: 140,
        ladoAlvo: 1,
        rolagem: 0,
        meioComprimento: 85,
      };
    } catch {
      tubaroes = [];
      atum = null;
    }
  }

  /* ---------- Perseguição ---------- */

  const alvo = new Vector3();

  function nadarAtum(a: Atum, dt: number, tempo: number) {
    // Sem cursor (celular parado, por exemplo), ele vagueia num oito largo.
    if (temCursor) alvo.copy(cursor);
    else alvo.set(Math.sin(tempo * 0.21) * largura * 0.3, Math.sin(tempo * 0.42) * altura * 0.22, 60);

    // Quem mira o alvo é o nariz, não o centro do corpo.
    const frenteX = Math.cos(a.pitch) * Math.cos(a.yaw);
    const frenteY = Math.sin(a.pitch);
    const narizX = a.posicao.x + frenteX * a.meioComprimento;
    const narizY = a.posicao.y + frenteY * a.meioComprimento;
    const dx = alvo.x - narizX;
    const dy = alvo.y - narizY;
    const distancia = Math.hypot(dx, dy);

    // Lado pro qual apontar, com folga pra não virar a cada tremida do mouse.
    if (dx > 80) a.ladoAlvo = 1;
    else if (dx < -80) a.ladoAlvo = -1;

    // O yaw vai de 0 a π passando por π/2: a volta é uma curva em U pela frente da câmera.
    // Assim ele nunca anda de ré nem fica de barriga pra cima.
    const yawAlvo = a.ladoAlvo === 1 ? 0 : Math.PI;
    const antes = a.yaw;
    const giro = MathUtils.lerp(1.4, 2.6, MathUtils.smoothstep(a.velocidade, 60, 480));
    a.yaw += MathUtils.clamp(yawAlvo - a.yaw, -giro * dt, giro * dt);
    const velocidadeGiro = (a.yaw - antes) / Math.max(dt, 0.0001);

    // Pitch: nariz sobe ou desce em direção ao alvo, sem empinar.
    const pitchAlvo = distancia < 40 ? 0 : MathUtils.clamp(Math.atan2(dy, Math.max(Math.abs(dx), 60)), -0.95, 0.95);
    a.pitch += MathUtils.clamp(pitchAlvo - a.pitch, -1.5 * dt, 1.5 * dt);

    // Velocidade: longe, arranca; perto, desliza devagar. Nunca para e nunca dá ré.
    const velocidadeAlvo = MathUtils.lerp(60, 480, MathUtils.smoothstep(distancia, 30, 650));
    a.velocidade += (velocidadeAlvo - a.velocidade) * Math.min(1, dt * 1.6);

    // Sempre na direção do nariz.
    a.posicao.x += frenteX * a.velocidade * dt;
    a.posicao.y += frenteY * a.velocidade * dt;
    a.posicao.z = 60 + Math.sin(a.yaw) * 150; // no meio da curva ele chega mais perto da tela
    a.posicao.x = MathUtils.clamp(a.posicao.x, -largura * 0.65, largura * 0.65);
    a.posicao.y = MathUtils.clamp(a.posicao.y, -altura * 0.6, altura * 0.6);

    // Inclina o corpo na curva, como peixe de verdade.
    const rolagemAlvo = MathUtils.clamp(velocidadeGiro * 0.2, -0.5, 0.5);
    a.rolagem += (rolagemAlvo - a.rolagem) * Math.min(1, dt * 3);

    a.raiz.position.copy(a.posicao);
    // Ordem YZX: rolagem no eixo do corpo, depois pitch, depois yaw (-yaw porque +Z sai da tela).
    a.raiz.rotation.set(a.rolagem, -a.yaw, a.pitch, "YZX");

    // A cauda bate mais rápido quando ele acelera.
    a.mixer.timeScale = MathUtils.lerp(0.8, 2.8, MathUtils.smoothstep(a.velocidade, 60, 480));
    a.mixer.update(dt);
  }

  return {
    medir(w: number, h: number) {
      largura = w;
      altura = h;
    },
    /** Posição do ponteiro em pixels, com origem no centro da tela e y pra cima. */
    seguir(x: number, y: number) {
      cursor.set(x, y, 60);
      temCursor = true;
    },
    atualizar(dt: number, tempo: number, abismo: number) {
      const ativo = abismo > 0.01;
      grupo.visible = ativo;
      cena.fog = ativo ? nevoa : null;
      if (!ativo) return;
      if (!carregando) carregar();

      ambiente.intensity = 0.9 * abismo;
      deCima.intensity = 1.3 * abismo;
      lanterna.position.set(cursor.x, cursor.y, 280);
      lanterna.intensity = (temCursor ? 4 : 0) * abismo;

      for (const t of tubaroes) {
        if (t.espera > 0) {
          t.espera -= dt;
          t.raiz.visible = false;
          continue;
        }
        t.raiz.visible = true;
        t.raiz.position.x += t.direcao * t.velocidade * dt;
        t.raiz.position.y = t.y + Math.sin(tempo * 0.35 + t.fase) * 35;
        // O clipe bate a cauda 2 vezes em 4,58 s; cada batida empurra uns 70% do corpo (520).
        // Nessa conta, a animação em 1x nada a ~160 px/s: a cauda acompanha a velocidade real.
        t.mixer.update(dt * (t.velocidade / 160));
        definirOpacidade(t.raiz, abismo);
        if (Math.abs(t.raiz.position.x) > largura * 1.1 + 1000) reposicionar(t);
      }

      if (atum) {
        nadarAtum(atum, Math.min(dt, 1 / 20), tempo);
        definirOpacidade(atum.raiz, abismo);
      }
    },
  };
}
