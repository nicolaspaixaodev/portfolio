/**
 * Geometria do tambor de serviços da home. O CSS (sem WebGL) e a água (WebGL)
 * usam as mesmas contas, então a face gira igual nos dois.
 *
 * Cada linha é um prisma de 4 faces girando num eixo vertical. Em repouso, a
 * face da frente fica chapada e as vizinhas aparecem de lado, bem inclinadas,
 * como no rascunho. Girando, a da frente dobra pela quina e a vizinha assume.
 */
export const FACES = 4;

/** Inclinação das faces vizinhas em repouso: bem de lado, só uma fresta. */
const ABERTA = (68 * Math.PI) / 180;

/**
 * Distância do olho até o tambor, em larguras de face. Cada linha tem a própria
 * perspectiva, centrada nela: assim as duas frestas aparecem iguais, onde quer
 * que a coluna esteja na tela.
 */
export const FOCO = 2.2;

/** Vão entre a face da frente e as vizinhas, em larguras de face (o rascunho separa as peças). */
export const FRESTA = 0.06;

/** Raio dos cantos das faces, em px. */
export const RAIO = 10;

/** Quanto falta pra face chegar à frente, entre -2 e 2 (0 = de frente). */
export function distancia(face: number, giro: number) {
  let d = (face - giro) % FACES;
  if (d > 2) d -= FACES;
  if (d <= -2) d += FACES;
  return d;
}

export type Pose = {
  /** Deslocamento do centro da face em relação ao centro do espaço, em px. */
  x: number;
  /** Profundidade em px (negativa = mais longe). */
  z: number;
  /** Giro no eixo vertical, em radianos. */
  angulo: number;
  visivel: boolean;
  /** 0 de frente, 1 de perfil: escurece a face que vira. */
  sombra: number;
};

export function pose(d: number, largura: number): Pose {
  const a = Math.min(Math.abs(d), 2);
  const lado = d < 0 ? -1 : 1;
  const meia = largura / 2;
  const vao = largura * FRESTA;
  if (a >= 1.5) return { x: lado * (meia + vao), z: -meia, angulo: (lado * Math.PI) / 2, visivel: false, sombra: 1 };
  // Até a = 1 a face dobra pela quina, que anda de uma borda até depois do vão; depois fica de perfil e some.
  // No meio do giro as duas faces ficam com o mesmo vão entre si.
  const theta = a <= 1 ? a * ABERTA : ABERTA + (Math.PI / 2 - ABERTA) * ((a - 1) / 0.5);
  const quina = a <= 1 ? -meia + (largura + vao) * a : meia + vao;
  return {
    x: lado * (quina + meia * Math.cos(theta)),
    z: -meia * Math.sin(theta),
    angulo: lado * theta,
    visivel: true,
    sombra: Math.sin(theta),
  };
}
