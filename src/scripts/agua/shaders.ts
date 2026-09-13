/** Shaders da água: as imagens da página e o fundo embaixo d'água. */

const RUIDO = /* glsl */ `
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Rede de luz do mar raso: ondas cruzadas dobram a luz e as linhas claras
  // aparecem onde a superfície concentra os raios.
  float causticas(vec2 p, float t) {
    vec2 q = p;
    float soma = 0.0;
    for (int i = 0; i < 3; i++) {
      float f = float(i);
      q += 0.5 * vec2(sin(q.y * 1.7 + t * 0.52 + f * 1.3), sin(q.x * 1.5 - t * 0.43 + f * 2.1));
      soma += sin(q.x * 2.3 + t * 0.27) * sin(q.y * 2.1 - t * 0.21);
    }
    float v = abs(soma / 3.0);
    return pow(1.0 - clamp(v, 0.0, 1.0), 7.0);
  }

  // Altura da linha d'água na tela (0 = base, 1 = topo) enquanto a água sobe.
  // As ondas só aparecem no meio da subida; cheia ou vazia, a linha fica fora da tela.
  float linhaAgua(float x, float nivel, float t) {
    float onda = sin(x * 7.0 + t * 1.1) * 0.016 + sin(x * 19.0 - t * 1.7) * 0.007 + sin(x * 2.3 - t * 0.6) * 0.012;
    float meio = clamp(nivel * (1.0 - nivel) * 4.0, 0.0, 1.0);
    return mix(-0.08, 1.08, nivel) + onda * meio;
  }

  // 1 embaixo d'água, 0 acima da linha.
  float submerso(vec2 tela, float profundidade, float t) {
    float nivel = clamp(profundidade, 0.0, 1.0);
    if (nivel <= 0.0001) return 0.0;
    if (nivel >= 0.9999) return 1.0;
    float l = linhaAgua(tela.x, nivel, t);
    return 1.0 - smoothstep(l - 0.0015, l + 0.0015, tela.y);
  }
`;

export const VERTICE_IMAGEM = /* glsl */ `
  uniform vec2 uViewport;
  uniform float uVelocidade;
  uniform float uEixo;
  uniform float uCurva;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    vec4 centro = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);

    // Estica com a velocidade: quanto mais longe do centro da tela, mais estica.
    float forca = clamp(abs(uVelocidade) * 0.006, 0.0, 0.4);
    vec4 mundo = modelMatrix * vec4(p, 1.0);
    float yTela = mundo.y / (uViewport.y * 0.5);
    float xTela = mundo.x / (uViewport.x * 0.5);
    if (uEixo < 0.5) {
      p.x *= 1.0 + forca * yTela * yTela;
    } else {
      p.y *= 1.0 + forca * xTela * xTela * 0.6;
    }
    mundo = modelMatrix * vec4(p, 1.0);

    // Embaixo d'água o carrossel se curva por dentro de um cilindro: as bordas vêm pra frente.
    mundo.z += uCurva * xTela * xTela * uViewport.x * 0.24;

    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`;

export const FRAGMENTO_IMAGEM = /* glsl */ `
  uniform sampler2D uTextura;
  uniform sampler2D uTinta;
  uniform sampler2D uFluxo;
  uniform vec2 uResolucao;
  uniform vec2 uEscala;
  uniform vec2 uDeslocamento;
  uniform float uTempo;
  uniform float uProfundidade;
  uniform float uSempreCor;
  uniform float uCheia;
  varying vec2 vUv;

  ${RUIDO}

  void main() {
    vec2 tela = gl_FragCoord.xy / uResolucao;
    float agua = submerso(tela, uProfundidade, uTempo);
    float fundo = clamp(uProfundidade - 1.0, 0.0, 1.0);
    float abismo = clamp(uProfundidade - 2.0, 0.0, 1.0);
    float profundo = smoothstep(1.45, 1.55, uProfundidade);

    vec2 fluxo = texture2D(uFluxo, tela).xy;
    float tinta = texture2D(uTinta, tela).r;
    // Borda nítida, como um rasgo na superfície.
    float revela = smoothstep(0.06, 0.11, tinta);
    float espuma = smoothstep(0.03, 0.06, tinta) - smoothstep(0.06, 0.1, tinta);

    // Refração: a água mexida entorta a imagem.
    vec2 uv = vUv + fluxo * 0.000018 * (0.25 + revela + agua);
    vec2 uvT = uDeslocamento + clamp(uv, 0.0, 1.0) * uEscala;

    float separa = 0.0008 * revela + 0.0004 * agua;
    vec3 cor = vec3(
      texture2D(uTextura, uvT + vec2(separa, 0.0)).r,
      texture2D(uTextura, uvT).g,
      texture2D(uTextura, uvT - vec2(separa, 0.0)).b
    );

    // Superfície desbotada pelo sol: duas cores, da tinta ao sol, com granulado forte.
    float luma = dot(cor, vec3(0.299, 0.587, 0.114));
    float grao = hash(gl_FragCoord.xy + floor(uTempo * 24.0) * 17.31) - 0.5;
    luma = clamp((luma - 0.5) * 1.1 + 0.54 + grao * 0.2, 0.0, 1.0);
    vec3 tintaCor = vec3(0.043, 0.122, 0.141);
    vec3 solCor = vec3(0.965, 0.973, 0.969);
    vec3 pb = mix(tintaCor, solCor, luma);

    float mistura = max(max(max(revela, agua), uSempreCor), uCheia);
    // No escuro é o contrário: dentro da pincelada a foto volta a ser a da superfície.
    mistura = mix(mistura, 1.0 - revela, profundo);
    vec3 final = mix(pb, cor, mistura);

    // Espuma clara na borda de onde a água abriu.
    final = mix(final, vec3(0.94, 1.0, 0.97), clamp(espuma, 0.0, 1.0) * 0.12 * (1.0 - agua));

    // Luz do raso passando por cima dos prints.
    float c = causticas(tela * vec2(uResolucao.x / uResolucao.y, 1.0) * 3.0, uTempo);
    float molhado = agua * (1.0 - revela * profundo);
    final += vec3(0.94, 1.0, 0.97) * c * 0.2 * molhado * (1.0 - fundo * 0.55);
    final = mix(final, final * vec3(0.8, 1.0, 0.95), molhado * (0.28 + fundo * 0.2));
    // No abismo, o trabalho aparece como se fosse iluminado de perto, cercado de escuro.
    final *= mix(1.0, 0.78, abismo * (1.0 - revela));
    final = mix(final, mix(pb, cor, mistura), revela * profundo);

    gl_FragColor = vec4(final, 1.0);
  }
`;

export const VERTICE_TITULO = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const FRAGMENTO_TITULO = /* glsl */ `
  uniform sampler2D uTexto;
  uniform sampler2D uTinta;
  uniform vec2 uResolucao;
  uniform vec2 uFranja;
  uniform float uTempo;
  uniform float uProfundidade;
  varying vec2 vUv;

  void main() {
    vec2 tela = gl_FragCoord.xy / uResolucao;
    float rasgo = smoothstep(0.06, 0.11, texture2D(uTinta, tela).r);

    float a = texture2D(uTexto, vUv).a;
    float aR = texture2D(uTexto, vUv + uFranja).a;
    float aB = texture2D(uTexto, vUv - uFranja).a;

    // Fora da pincelada, o nome tem a cor do texto da profundidade atual.
    vec3 tintaCor = vec3(0.043, 0.122, 0.141);
    vec3 brilho = vec3(0.937, 1.0, 0.973);
    vec3 fora = mix(tintaCor, brilho, smoothstep(1.45, 1.55, uProfundidade));

    // Dentro dela, o nome clareia e ganha franja amarela e verde-mar nas bordas.
    vec3 amarelo = vec3(1.0, 0.824, 0.247);
    vec3 verde = vec3(0.122, 0.639, 0.588);
    vec3 dentroBase = mix(brilho, tintaCor, smoothstep(1.45, 1.55, uProfundidade));
    vec3 dentroPre = dentroBase * a + amarelo * max(aR - a, 0.0) + verde * max(aB - a, 0.0);
    float alfaDentro = clamp(max(a, max(aR, aB)), 0.0, 1.0);

    vec3 corPre = mix(fora * a, dentroPre, rasgo);
    float alfa = mix(a, alfaDentro, rasgo);
    if (alfa < 0.003) discard;
    gl_FragColor = vec4(corPre / alfa, alfa);
  }
`;

export const VERTICE_TELA = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const FRAGMENTO_FUNDO = /* glsl */ `
  uniform sampler2D uFluxo;
  uniform sampler2D uTinta;
  uniform vec2 uResolucao;
  uniform float uTempo;
  uniform float uProfundidade;
  varying vec2 vUv;

  ${RUIDO}

  void main() {
    float nivel = clamp(uProfundidade, 0.0, 1.0);
    float agua = submerso(vUv, uProfundidade, uTempo);
    float tinta = texture2D(uTinta, vUv).r;
    float rasgo = smoothstep(0.06, 0.11, tinta);

    // A linha d'água amarela acompanha a superfície enquanto ela sobe.
    float subindo = step(0.0001, nivel) * step(nivel, 0.9999);
    float l = linhaAgua(vUv.x, nivel, uTempo);
    float naLinha = subindo * exp(-abs(vUv.y - l) * uResolucao.y * 0.45);

    // Na superfície, o rastro do mouse abre um buraco e mostra a água de baixo.
    float alfa = max(max(agua, rasgo), naLinha);
    if (alfa < 0.002) discard;
    float fundo = clamp(uProfundidade - 1.0, 0.0, 1.0);
    float abismo = clamp(uProfundidade - 2.0, 0.0, 1.0);

    vec3 verdeMar = vec3(0.1216, 0.6392, 0.5882);
    vec3 escuro = vec3(0.051, 0.369, 0.42);
    vec3 abissal = vec3(0.016, 0.082, 0.106);
    vec3 base = mix(verdeMar, escuro, fundo);
    base = mix(base, abissal * mix(0.75, 1.25, vUv.y), abismo);
    base *= mix(mix(0.9, 1.07, vUv.y), 1.0, abismo);

    vec2 fluxo = texture2D(uFluxo, vUv).xy;
    vec2 p = vUv * vec2(uResolucao.x / uResolucao.y, 1.0) * 2.4 + fluxo * 0.0005;
    float c = causticas(p, uTempo);
    float c2 = causticas(p * 1.9 + 3.7, uTempo * 1.2);
    // Na superfície, dentro do rasgo, a água é mais chapada e calma; embaixo, a luz aparece inteira.
    float luz = mix(0.35, 1.0, agua);
    // Cáusticas contidas: rótulos pequenos por cima precisam de contraste.
    base += vec3(0.94, 1.0, 0.97) * (c * 0.1 + c2 * 0.035) * (1.0 - fundo * 0.4) * luz * (1.0 - abismo);

    // No fundo, feixes de luz descem da superfície.
    float feixe = pow(max(0.0, sin(vUv.x * 7.0 + sin(uTempo * 0.2) * 0.8 + vUv.y * 1.4)), 12.0);
    base += vec3(0.94, 1.0, 0.97) * feixe * 0.05 * fundo * vUv.y * (1.0 - abismo);

    // Logo abaixo da superfície a água é mais clara.
    base += vec3(0.94, 1.0, 0.97) * smoothstep(l - 0.18, l, vUv.y) * agua * subindo * 0.18;

    // Partículas em suspensão: sobem quando você desce.
    vec2 g = vec2(vUv.x * uResolucao.x / uResolucao.y, vUv.y + uProfundidade * 0.85 + uTempo * 0.006) * 24.0;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5 - (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.6;
    float particula = step(0.9, hash(id)) * smoothstep(0.09, 0.0, length(f));
    // No abismo as partículas viram neve marinha e, algumas, bioluminescência.
    float cintila = 0.5 + 0.5 * sin(uTempo * 1.7 + hash(id) * 40.0);
    vec3 corParticula = mix(vec3(0.94, 1.0, 0.97), vec3(0.45, 1.0, 0.88), step(0.97, hash(id + 1.3)) * abismo);
    base += corParticula * particula * (0.08 + fundo * 0.1 + abismo * 0.12 * cintila) * agua;

    // Embaixo d'água, o rastro do mouse deixa passar mais luz; no abismo, vira trilha bioluminescente.
    base += vec3(0.94, 1.0, 0.97) * rasgo * agua * 0.1 * (1.0 - abismo);


    base = mix(base, vec3(1.0, 0.824, 0.247), clamp(naLinha, 0.0, 1.0));

    // No Fundo e no Abismo, a pincelada abre uma janela pra superfície: fundo sol.
    base = mix(base, vec3(0.965, 0.973, 0.969), rasgo * smoothstep(1.45, 1.55, uProfundidade));

    float grao = hash(gl_FragCoord.xy + fract(uTempo * 5.0) * 71.0) - 0.5;
    base += grao * 0.02;

    gl_FragColor = vec4(base, alfa);
  }
`;
