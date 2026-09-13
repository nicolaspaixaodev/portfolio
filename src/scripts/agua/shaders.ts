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
  uniform float uFace;
  uniform vec2 uTamanho;
  uniform vec3 uPose;
  uniform float uFoco;
  varying vec2 vUv;
  varying vec2 vLocal;

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

    // Face do tambor da home: gira no próprio eixo com a perspectiva centrada na linha
    // (uPose = x, z, ângulo). O plano continua chapado em z = 0; só os vértices andam.
    vLocal = position.xy * uTamanho;
    if (uFace > 0.5) {
      vec2 v = p.xy * uTamanho;
      float c = cos(uPose.z);
      float s = sin(uPose.z);
      vec3 r = vec3(v.x * c + uPose.x, v.y, -v.x * s + uPose.y);
      float k = uFoco / (uFoco - r.z);
      vec4 centro = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      mundo = vec4(centro.xy + r.xy * k, 0.0, 1.0);
      // Curva de tambor na vertical: perto do topo e da base da tela, a linha estreita um pouco.
      float yT = clamp(mundo.y / (uViewport.y * 0.5), -1.2, 1.2);
      mundo.x = centro.x + (mundo.x - centro.x) * (1.0 - 0.09 * yT * yT);
    }

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
  uniform float uSombra;
  uniform float uCorte;
  uniform float uFace;
  uniform vec2 uTamanho;
  uniform float uRaio;
  uniform float uOpacidade;
  uniform vec3 uPose;
  varying vec2 vUv;
  varying vec2 vLocal;

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
    // Na fresta do tambor (face quase de perfil), só o tom borrado da face vizinha, sem o texto.
    float desfoque = step(0.5, uFace) * smoothstep(0.5, 0.9, uSombra) * 7.0;
    vec3 cor = vec3(
      texture2D(uTextura, uvT + vec2(separa, 0.0), desfoque).r,
      texture2D(uTextura, uvT, desfoque).g,
      texture2D(uTextura, uvT - vec2(separa, 0.0), desfoque).b
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

    // Face do tambor virando: escurece conforme sai de frente, e uma faixa de sol
    // atravessa a face no meio do giro, pra ela ler como objeto.
    final *= 1.0 - uSombra * 0.7;
    if (uFace > 0.5) {
      float xN = vLocal.x / uTamanho.x + 0.5;
      float lado = uPose.z < 0.0 ? -1.0 : 1.0;
      float centroFaixa = 0.5 - lado * (uSombra * 1.4 - 0.35);
      float faixa = exp(-pow((xN - centroFaixa) * 4.5, 2.0));
      float noGiro = smoothstep(0.08, 0.4, uSombra) * (1.0 - smoothstep(0.7, 0.9, uSombra));
      final += vec3(0.965, 0.973, 0.969) * faixa * noGiro * 0.16;
    }

    // Some suave logo abaixo do cabeçalho fixo (uCorte em px da tela, de cima).
    float topo = uResolucao.y - uCorte;
    float visivel = 1.0 - smoothstep(topo - 28.0, topo, gl_FragCoord.y) * step(0.5, uCorte);
    // Cantos arredondados nas faces do tambor. A conta é feita já achatada pelo giro,
    // pra fresta (quase de perfil) ter o mesmo raio na tela e borda sem serrilhado.
    if (uFace > 0.5) {
      float achata = max(abs(cos(uPose.z)), 0.1);
      vec2 local = vLocal * vec2(achata, 1.0);
      vec2 meio = uTamanho * 0.5 * vec2(achata, 1.0);
      vec2 q = abs(local) - (meio - uRaio - 0.75);
      float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRaio;
      visivel *= 1.0 - smoothstep(-0.9, 0.6, dist);
    }
    visivel *= uOpacidade;
    if (visivel < 0.002) discard;

    gl_FragColor = vec4(final, visivel);
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
  uniform vec2 uPonteiro;
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

    // Neve marinha: três camadas de flocos irregulares. A de perto é grande e
    // desfocada, a do meio é nítida, a de longe é miúda. Afundam devagar,
    // balançam de lado e sobem quando você desce.
    float aspecto = uResolucao.x / uResolucao.y;
    vec2 ponteiro = (vUv - uPonteiro) * vec2(aspecto, 1.0);
    float lanterna = exp(-dot(ponteiro, ponteiro) * 9.0) * abismo;
    float neve = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float escala = 9.0 + fi * 11.0;
      float perto = 1.0 - fi * 0.5;
      vec2 q = vec2(vUv.x * aspecto, vUv.y) * escala;
      q.y += (uProfundidade * (0.5 + perto * 0.6) + uTempo * (0.012 + perto * 0.018)) * escala;
      q.x += sin(uTempo * (0.21 + fi * 0.07) + q.y * 0.35 + fi * 2.0) * 0.28;
      vec2 id = floor(q);
      float h = hash(id + fi * 19.7);
      if (h < 0.78 + fi * 0.05) continue;
      vec2 f = fract(q) - 0.5 - (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.55;
      float giro = hash(id + 11.3) * 6.2832;
      f = mat2(cos(giro), -sin(giro), sin(giro), cos(giro)) * f;
      f.x *= mix(1.0, 1.6, hash(id + 5.9));
      float raio = mix(0.025, 0.12, pow(hash(id + 2.3), 2.0)) * mix(0.6, 1.2, perto);
      float ang = atan(f.y, f.x);
      float irregular = 1.0 + 0.14 * sin(ang * 2.0 + h * 40.0) + 0.08 * sin(ang * 5.0 + h * 17.0);
      float borda = raio * (0.35 + perto * perto * 0.9) + 0.012;
      float floco = 1.0 - smoothstep(raio * irregular - borda, raio * irregular + borda, length(f));
      neve += floco * mix(0.35, 1.0, perto * (1.0 - perto) * 4.0 + (1.0 - perto) * 0.15);
    }
    float cintila = 0.6 + 0.4 * sin(uTempo * 1.3 + vUv.x * 40.0);
    vec3 corNeve = mix(vec3(0.94, 1.0, 0.97), vec3(0.6, 1.0, 0.9), abismo * 0.5);
    base += corNeve * neve * (0.07 + fundo * 0.08 + abismo * (0.05 + 0.1 * cintila) + lanterna * 1.8) * agua;
    // A lanterna do ponteiro: um halo frio e fraco na água escura.
    base += vec3(0.37, 0.95, 0.86) * lanterna * 0.1 * agua;

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
