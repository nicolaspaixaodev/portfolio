/** Valores que o movimento em HTML compartilha com a água em WebGL. */
export const estado = {
  /** Velocidade da rolagem da página (px por quadro). */
  rolagem: 0,
  /** Velocidade do carrossel do projeto (px por quadro). */
  carrossel: 0,
  /** Profundidade contínua: 0 superfície, 1 raso, 2 fundo, 3 abismo. */
  profundidade: 0,
  /**
   * Um carrossel pode tomar a rolagem antes da descida na água.
   * Devolve true quando consumiu o movimento.
   */
  consumirRolagem: null as ((deltaY: number) => boolean) | null,
  /** Tambor da home: quanto falta pra cada face chegar à frente (ver scripts/tambor.ts). */
  faces: new WeakMap<Element, number>(),
};
