/**
 * Fluido na GPU (stable fluids): o ponteiro empurra a água e deixa tinta.
 * A tinta é a máscara que revela a cor; a velocidade distorce as imagens.
 */
import {
  ClampToEdgeWrapping,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type Texture,
  type WebGLRenderer,
} from "three";

const VERTICE = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 uTexel;
  void main() {
    vUv = uv;
    vL = vUv - vec2(uTexel.x, 0.0);
    vR = vUv + vec2(uTexel.x, 0.0);
    vT = vUv + vec2(0.0, uTexel.y);
    vB = vUv - vec2(0.0, uTexel.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const RESPINGO = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uAlvo;
  uniform float uAspecto;
  uniform vec3 uCor;
  uniform vec2 uPonto;
  uniform float uRaio;
  void main() {
    vec2 p = vUv - uPonto;
    p.x *= uAspecto;
    vec3 respingo = exp(-dot(p, p) / uRaio) * uCor;
    gl_FragColor = vec4(min(texture2D(uAlvo, vUv).xyz + respingo, vec3(1000.0, 1000.0, 1.0)), 1.0);
  }
`;

const ADVECCAO = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uVelocidade;
  uniform sampler2D uFonte;
  uniform vec2 uTexel;
  uniform float uDt;
  uniform float uDissipacao;
  void main() {
    vec2 origem = vUv - uDt * texture2D(uVelocidade, vUv).xy * uTexel;
    gl_FragColor = texture2D(uFonte, origem) / (1.0 + uDissipacao * uDt);
  }
`;

const ROTACIONAL = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocidade;
  void main() {
    float L = texture2D(uVelocidade, vL).y;
    float R = texture2D(uVelocidade, vR).y;
    float T = texture2D(uVelocidade, vT).x;
    float B = texture2D(uVelocidade, vB).x;
    gl_FragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
  }
`;

const VORTICIDADE = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocidade;
  uniform sampler2D uRotacional;
  uniform float uIntensidade;
  uniform float uDt;
  void main() {
    float L = texture2D(uRotacional, vL).x;
    float R = texture2D(uRotacional, vR).x;
    float T = texture2D(uRotacional, vT).x;
    float B = texture2D(uRotacional, vB).x;
    float C = texture2D(uRotacional, vUv).x;
    vec2 forca = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    forca /= length(forca) + 0.0001;
    forca *= uIntensidade * C;
    forca.y *= -1.0;
    vec2 v = texture2D(uVelocidade, vUv).xy + forca * uDt;
    gl_FragColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
  }
`;

const DIVERGENCIA = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocidade;
  void main() {
    float L = texture2D(uVelocidade, vL).x;
    float R = texture2D(uVelocidade, vR).x;
    float T = texture2D(uVelocidade, vT).y;
    float B = texture2D(uVelocidade, vB).y;
    vec2 C = texture2D(uVelocidade, vUv).xy;
    if (vL.x < 0.0) L = -C.x;
    if (vR.x > 1.0) R = -C.x;
    if (vT.y > 1.0) T = -C.y;
    if (vB.y < 0.0) B = -C.y;
    gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
  }
`;

const ESVAZIAR = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTextura;
  uniform float uValor;
  void main() {
    gl_FragColor = uValor * texture2D(uTextura, vUv);
  }
`;

const PRESSAO = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressao;
  uniform sampler2D uDivergencia;
  void main() {
    float L = texture2D(uPressao, vL).x;
    float R = texture2D(uPressao, vR).x;
    float T = texture2D(uPressao, vT).x;
    float B = texture2D(uPressao, vB).x;
    float d = texture2D(uDivergencia, vUv).x;
    gl_FragColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
  }
`;

const GRADIENTE = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressao;
  uniform sampler2D uVelocidade;
  void main() {
    float L = texture2D(uPressao, vL).x;
    float R = texture2D(uPressao, vR).x;
    float T = texture2D(uPressao, vT).x;
    float B = texture2D(uPressao, vB).x;
    vec2 v = texture2D(uVelocidade, vUv).xy - vec2(R - L, T - B);
    gl_FragColor = vec4(v, 0.0, 1.0);
  }
`;

class Par {
  ler: WebGLRenderTarget;
  escrever: WebGLRenderTarget;

  constructor(largura: number, altura: number, filtro: typeof LinearFilter | typeof NearestFilter) {
    const criar = () =>
      new WebGLRenderTarget(largura, altura, {
        type: HalfFloatType,
        format: RGBAFormat,
        minFilter: filtro,
        magFilter: filtro,
        wrapS: ClampToEdgeWrapping,
        wrapT: ClampToEdgeWrapping,
        depthBuffer: false,
      });
    this.ler = criar();
    this.escrever = criar();
  }

  trocar() {
    [this.ler, this.escrever] = [this.escrever, this.ler];
  }

  dispose() {
    this.ler.dispose();
    this.escrever.dispose();
  }
}

export class Fluido {
  private renderer: WebGLRenderer;
  private cena = new Scene();
  private camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private quad: Mesh;

  private velocidade!: Par;
  private tinta!: Par;
  private pressao!: Par;
  private divergencia!: WebGLRenderTarget;
  private rotacional!: WebGLRenderTarget;
  private texelSim = new Vector2();
  private texelTinta = new Vector2();
  private aspecto = 1;

  private m: Record<string, ShaderMaterial>;

  constructor(renderer: WebGLRenderer) {
    this.renderer = renderer;
    const material = (fragmentShader: string, uniforms: Record<string, { value: unknown }>) =>
      new ShaderMaterial({ vertexShader: VERTICE, fragmentShader, uniforms: { uTexel: { value: new Vector2() }, ...uniforms }, depthTest: false, depthWrite: false });

    this.m = {
      respingo: material(RESPINGO, { uAlvo: { value: null }, uAspecto: { value: 1 }, uCor: { value: new Vector3() }, uPonto: { value: new Vector2() }, uRaio: { value: 0.002 } }),
      adveccao: material(ADVECCAO, { uVelocidade: { value: null }, uFonte: { value: null }, uDt: { value: 0.016 }, uDissipacao: { value: 0.2 } }),
      rotacional: material(ROTACIONAL, { uVelocidade: { value: null } }),
      vorticidade: material(VORTICIDADE, { uVelocidade: { value: null }, uRotacional: { value: null }, uIntensidade: { value: 9 }, uDt: { value: 0.016 } }),
      divergencia: material(DIVERGENCIA, { uVelocidade: { value: null } }),
      esvaziar: material(ESVAZIAR, { uTextura: { value: null }, uValor: { value: 0.8 } }),
      pressao: material(PRESSAO, { uPressao: { value: null }, uDivergencia: { value: null } }),
      gradiente: material(GRADIENTE, { uPressao: { value: null }, uVelocidade: { value: null } }),
    };

    this.quad = new Mesh(new PlaneGeometry(2, 2), this.m.respingo);
    this.quad.frustumCulled = false;
    this.cena.add(this.quad);
  }

  get texturaTinta(): Texture {
    return this.tinta.ler.texture;
  }

  get texturaVelocidade(): Texture {
    return this.velocidade.ler.texture;
  }

  redimensionar(largura: number, altura: number) {
    this.aspecto = largura / altura;
    const tamanho = (base: number) => {
      const menor = Math.round(base);
      const maior = Math.round(base * Math.max(this.aspecto, 1 / this.aspecto));
      return this.aspecto > 1 ? [maior, menor] : [menor, maior];
    };
    const [sw, sh] = tamanho(112);
    const [tw, th] = tamanho(384);

    this.velocidade?.dispose();
    this.tinta?.dispose();
    this.pressao?.dispose();
    this.divergencia?.dispose();
    this.rotacional?.dispose();

    this.velocidade = new Par(sw, sh, LinearFilter);
    this.tinta = new Par(tw, th, LinearFilter);
    this.pressao = new Par(sw, sh, NearestFilter);
    this.divergencia = new WebGLRenderTarget(sw, sh, { type: HalfFloatType, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false });
    this.rotacional = new WebGLRenderTarget(sw, sh, { type: HalfFloatType, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false });
    this.texelSim.set(1 / sw, 1 / sh);
    this.texelTinta.set(1 / tw, 1 / th);
  }

  private passo(material: ShaderMaterial, alvo: WebGLRenderTarget, texel = this.texelSim) {
    material.uniforms.uTexel.value.copy(texel);
    this.quad.material = material;
    this.renderer.setRenderTarget(alvo);
    this.renderer.render(this.cena, this.camera);
  }

  /** x, y em 0..1 (y pra cima); dx, dy em fração da tela por quadro. */
  respingar(x: number, y: number, dx: number, dy: number, tinta: number) {
    const m = this.m.respingo;
    m.uniforms.uAspecto.value = this.aspecto;
    m.uniforms.uPonto.value.set(x, y);
    m.uniforms.uRaio.value = 0.0013 * (this.aspecto > 1 ? this.aspecto : 1);

    m.uniforms.uAlvo.value = this.velocidade.ler.texture;
    m.uniforms.uCor.value.set(dx * 2600, dy * 2600, 0);
    this.passo(m, this.velocidade.escrever);
    this.velocidade.trocar();

    m.uniforms.uAlvo.value = this.tinta.ler.texture;
    m.uniforms.uCor.value.set(tinta, tinta, tinta);
    this.passo(m, this.tinta.escrever, this.texelTinta);
    this.tinta.trocar();
  }

  /** dt: passo da simulação (limitado). dtReal: tempo de verdade, pra água sumir igual em qualquer máquina. */
  avancar(dt: number, dtReal = dt) {
    const { m } = this;

    m.rotacional.uniforms.uVelocidade.value = this.velocidade.ler.texture;
    this.passo(m.rotacional, this.rotacional);

    m.vorticidade.uniforms.uVelocidade.value = this.velocidade.ler.texture;
    m.vorticidade.uniforms.uRotacional.value = this.rotacional.texture;
    m.vorticidade.uniforms.uDt.value = dt;
    this.passo(m.vorticidade, this.velocidade.escrever);
    this.velocidade.trocar();

    m.divergencia.uniforms.uVelocidade.value = this.velocidade.ler.texture;
    this.passo(m.divergencia, this.divergencia);

    m.esvaziar.uniforms.uTextura.value = this.pressao.ler.texture;
    this.passo(m.esvaziar, this.pressao.escrever);
    this.pressao.trocar();

    m.pressao.uniforms.uDivergencia.value = this.divergencia.texture;
    for (let i = 0; i < 14; i++) {
      m.pressao.uniforms.uPressao.value = this.pressao.ler.texture;
      this.passo(m.pressao, this.pressao.escrever);
      this.pressao.trocar();
    }

    m.gradiente.uniforms.uPressao.value = this.pressao.ler.texture;
    m.gradiente.uniforms.uVelocidade.value = this.velocidade.ler.texture;
    this.passo(m.gradiente, this.velocidade.escrever);
    this.velocidade.trocar();

    // A dissipação usa o tempo real, compensando o passo limitado da simulação.
    const fator = dtReal / dt;
    m.adveccao.uniforms.uDt.value = dt;
    m.adveccao.uniforms.uVelocidade.value = this.velocidade.ler.texture;
    m.adveccao.uniforms.uFonte.value = this.velocidade.ler.texture;
    m.adveccao.uniforms.uDissipacao.value = 0.9 * fator;
    this.passo(m.adveccao, this.velocidade.escrever);
    this.velocidade.trocar();

    m.adveccao.uniforms.uVelocidade.value = this.velocidade.ler.texture;
    m.adveccao.uniforms.uFonte.value = this.tinta.ler.texture;
    m.adveccao.uniforms.uDissipacao.value = 3.2 * fator;
    // A tinta anda na escala da velocidade, mesmo tendo resolução maior.
    this.passo(m.adveccao, this.tinta.escrever);
    this.tinta.trocar();

    this.renderer.setRenderTarget(null);
  }

  dispose() {
    this.velocidade.dispose();
    this.tinta.dispose();
    this.pressao.dispose();
    this.divergencia.dispose();
    this.rotacional.dispose();
    Object.values(this.m).forEach((m) => m.dispose());
    this.quad.geometry.dispose();
  }
}
