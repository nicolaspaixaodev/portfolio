---
name: Nicolas Paixão
description: Portfólio de creative developer. Mar raso da Orla de Atalaia ao meio-dia, com página editorial ao sol, água em WebGL por baixo e um abismo escuro no fim da descida.
colors:
  sol: "#F6F8F7"
  tinta: "#0B1F24"
  tinta-suave: "#4A5F64"
  verde-mar: "#1FA396"
  fundo: "#0D5E6B"
  abismo: "#04151B"
  brilho: "#EFFFF8"
  brilho-suave: "#A8DAD2"
  brilho-abismo: "#8FB9B4"
  pino: "#FFD23F"
  pino-claro: "#FFDC66"
  atum-verde: "#3B8A8D"
  atum-olho: "#06181C"
  fio-superficie: "rgb(11 31 36 / 0.16)"
  fio-raso: "rgb(11 31 36 / 0.24)"
  fio-fundo: "rgb(239 255 248 / 0.22)"
  fio-abismo: "rgb(239 255 248 / 0.16)"
typography:
  display-nome:
    fontFamily: "Anybody Variable, Anybody, system-ui, sans-serif"
    fontSize: "min(6.1vw, 6rem)"
    fontWeight: 880
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 150"
  display-projeto:
    fontFamily: "Anybody Variable, Anybody, system-ui, sans-serif"
    fontSize: "min(4.9vw, 6rem)"
    fontWeight: 880
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 150"
  display-projeto-celular:
    fontFamily: "Anybody Variable, Anybody, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 10vw, 6rem)"
    fontWeight: 880
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 150"
  abertura:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2.35rem)"
    fontWeight: 400
    lineHeight: 1.22
    letterSpacing: "-0.01em"
  resumo:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.45
  corpo:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.45
  ui:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  rotulo:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  acao:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.45
rounded:
  foco: "2px"
  face: "10px"
  circulo: "50%"
  pilula: "999px"
spacing:
  margem: "clamp(1rem, 1.6vw, 1.5rem)"
  cabecalho: "3.5rem"
  respiro-cabecalho: "1.25rem"
  bloco: "2rem"
  secao: "3rem"
components:
  acao-principal:
    backgroundColor: "{colors.pino}"
    textColor: "{colors.tinta}"
    typography: "{typography.acao}"
    rounded: "{rounded.pilula}"
    padding: "0.7rem 1rem 0.7rem 1.1rem"
  acao-principal-hover:
    backgroundColor: "{colors.pino-claro}"
    textColor: "{colors.tinta}"
  pular-conteudo:
    backgroundColor: "{colors.pino}"
    textColor: "{colors.tinta}"
    typography: "{typography.acao}"
    padding: "0.6rem 0.9rem"
  profundidade-nivel:
    textColor: "{colors.tinta-suave}"
    typography: "{typography.ui}"
  profundidade-nivel-ativo:
    textColor: "{colors.tinta}"
  profundidade-lanterna:
    textColor: "{colors.tinta-suave}"
    size: "1.35rem"
  profundidade-linha:
    backgroundColor: "{colors.pino}"
    height: "3px"
  servicos-item:
    textColor: "{colors.tinta}"
    typography: "{typography.ui}"
  servicos-marca:
    backgroundColor: "{colors.pino}"
    width: "1rem"
    height: "3px"
  seta-giro:
    textColor: "{colors.tinta}"
    rounded: "{rounded.circulo}"
    size: "2.75rem"
  seta-giro-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.sol}"
  tambor-face:
    backgroundColor: "{colors.fio-superficie}"
    rounded: "{rounded.face}"
  midia:
    backgroundColor: "{colors.fio-superficie}"
  proximo-projeto-midia:
    backgroundColor: "{colors.fio-superficie}"
    width: "9rem"
  linha-mar:
    height: "16px"
    width: "200vw"
---

# Design System: Nicolas Paixão

## Overview

**Creative North Star: "Mar raso ao meio-dia"**

O site é o mar raso da Orla de Atalaia ao meio-dia. Em cima fica uma página editorial clara, em sol e tinta, com o nome em Anybody larga e pesada e os prints desbotados pelo sol. Embaixo há água em WebGL, que se aprofunda em quatro níveis nomeados: Superfície, Raso, Fundo e Abismo. O ponteiro rasga a superfície e mostra a água. Descer afunda a página inteira, e a linha d'água amarela marca onde a água está. No fim da descida fica o Abismo, o modo escuro, que continua sendo o mesmo mar: neve marinha, um atum verde-mar atrás do ponteiro e tubarões na névoa.

A densidade é baixa e editorial. Não há cards, painéis nem sombras. Os prints ficam soltos, os rótulos são pequenos e a linha d'água em amarelo pino é o único grafismo recorrente. A cor forte fica dentro dos prints. Na home, o trabalho aparece num tambor de serviços: cada linha é um prisma de quatro faces que gira em perspectiva, com as faces vizinhas visíveis como frestas. É o único objeto com volume na página, e o volume vem da geometria, nunca de sombra.

O movimento tem o ritmo da água rasa: lento, ondulado e refratado, sem pulo nem quique. A camada clara carrega primeiro e funciona inteira sem a água. O WebGL entra depois, por cima dela, e nunca é condição para ler, navegar ou chamar. Quando o WebGL redesenha textos ou prints, o DOM continua embaixo, legível e selecionável.

**Key Characteristics:**
- Quatro profundidades nomeadas e linkáveis (`?profundidade=superficie|raso|fundo|abismo`), cada uma com fundo, texto, texto suave e fio próprios. O Abismo abre pela lanterna do cabeçalho.
- Nome em Anybody a 150% de largura e peso 880, em caixa alta, com entrada em marola.
- Capas em duas cores (tinta a sol) com granulado, que ganham cor sob o ponteiro ou embaixo d'água.
- Tambor de serviços na home: quatro faces por linha, separadas por um vão, com cantos de 10px e giro em cascata.
- Linha d'água amarela: ondula no pé da tela, marca o nível ativo e o serviço de frente, e sobe com a água.
- Fluido real na GPU. Na Superfície, a pincelada revela a água e a cor. No Fundo e no Abismo, abre uma janela de volta para a superfície.
- Fallbacks completos para quem não tem WebGL, prefere movimento reduzido ou usa toque.

## Colors

Uma paleta de luz de meio-dia que escurece com a profundidade: branco quente de sol, tinta petróleo quase preta, três águas cada vez mais fundas e um único amarelo.

### Primary
- **Amarelo Sol a Pino** (pino): a única cor saturada da interface. Aparece na ação principal (WhatsApp), na linha d'água (onda do rodapé, traço do nível ativo, marca do serviço de frente, linha que sobe com a água), na seleção de texto, no link de pular para o conteúdo e na franja da pincelada sobre os textos. Nunca é fundo de área nem cor de texto.
- **Pino Claro** (pino-claro): só o hover da ação principal, que clareia o amarelo em 250ms em vez de mover a pílula.

### Secondary
- **Verde-Mar do Raso** (verde-mar): o fundo do Raso e a cor base da água em WebGL. Também é a franja verde da pincelada. Na Superfície, só surge dentro do rasgo aberto pelo ponteiro.
- **Fundo Petróleo** (fundo): o fundo do Fundo. No shader, a água passa do verde-mar para ele entre Raso e Fundo.
- **Abismo** (abismo): o fundo do Abismo, a cor da névoa 3D (de 1000 a 3400 unidades) e o tom da água no nível 3. É o único fundo escuro do sistema, e existe só nessa profundidade.

### Tertiary
- **Verde do Atum** (atum-verde): a cor do corpo do atum estilizado no Abismo. A textura original só sombreia (entre 62% e 112%), e um contorno de luz fria recorta o peixe contra o escuro. É o verde-mar do site apagado pela falta de luz, não uma cor de interface.
- **Olho do Atum** (atum-olho): o olho do atum, chapado e sem brilho.

### Neutral
- **Sol** (sol): o fundo da Superfície, o tom claro das capas em duas cores e o fundo da janela aberta pela pincelada no Fundo e no Abismo.
- **Tinta** (tinta): o texto na Superfície e no Raso, o tom escuro das capas em duas cores, o texto da ação amarela, a borda das setas de giro e da ação fixa no celular, e o texto dentro da janela da pincelada.
- **Tinta Suave** (tinta-suave): rótulos, a barra do PT/EN e os níveis inativos na Superfície. No Raso e durante a descida da Superfície ao Raso, os rótulos passam a tinta cheia.
- **Brilho** (brilho): o texto no Fundo e no Abismo. Na água em WebGL, é a cor da luz (cáusticas, neve marinha, feixes, espuma).
- **Brilho Suave** (brilho-suave): rótulos e níveis inativos no Fundo.
- **Brilho do Abismo** (brilho-abismo): rótulos e níveis inativos no Abismo, mais apagados que no Fundo porque o fundo é mais escuro.
- **Fios** (fio-superficie, fio-raso, fio-fundo, fio-abismo): a cor que ocupa o espaço da imagem enquanto ela carrega. Muda com a profundidade.

A areia molhada (#C9B48A) do contrato de direção continua declarada como `--areia` em `global.css`, mas nenhuma superfície entregue a usa. Por isso não entrou como token.

### Named Rules
**A Regra da Cor Presa.** Fora dos prints, a Superfície usa só sol, tinta e pino. A cor saturada do trabalho mora dentro das imagens e só escapa quando a água a revela. Vale também nas faces do tambor.

**A Regra do Amarelo Único.** O pino marca só duas coisas: onde a água está e a ação principal. O marcador do serviço de frente conta como linha d'água, porque tem a mesma forma (1rem × 3px). Um terceiro significado dilui os dois.

**A Regra da Troca por Profundidade.** Fundo, texto, texto suave e fio vêm das variáveis da profundidade (`--bg`, `--fg`, `--fg-2`, `--fio`), nunca de um hex direto no componente. A exceção é o pino, que vale igual nas quatro profundidades. As cores literais do WebGL (água, luzes, peixes) ficam nos shaders e no módulo do abismo, e espelham os tokens.

**A Regra do Escuro Só no Fundo do Mar.** O sistema recusa o portfólio de fundo escuro. O escuro existe só como a quarta profundidade, alcançada descendo ou pela lanterna, e continua sendo água (neve, peixes, névoa), nunca um tema neutro.

## Typography

**Display Font:** Anybody Variable (com Anybody e system-ui como fallback)
**Body Font:** Atkinson Hyperlegible Next Variable (com Atkinson Hyperlegible Next e system-ui como fallback)

**Character:** Um display largo e pesado, de placa de orla, contra um texto feito para ser lido no sol do celular. O display grita o nome, e todo o resto fala baixo.

### Hierarchy
- **Display** (Anybody, peso 880, largura 150%, caixa alta, altura de linha 0.9, espaçamento -0.01em, `text-wrap: balance`): só o nome na home, o nome do projeto e "Sobre". O nome da home ocupa a coluna esquerda no desktop (42vw) e a largura inteira no celular, em duas linhas (largura útil ÷ 7.5). O título do projeto fica centralizado, em tamanho fluido no celular e preso à largura da tela no desktop. "Sobre" usa min(11vw, 6rem) no desktop e largura útil ÷ 3.6 no celular.
- **Abertura** (Atkinson 400, altura de linha 1.22, até 28ch): o primeiro parágrafo do Sobre, que entra linha por linha.
- **Resumo** (Atkinson 400, altura de linha 1.45, até 34rem): o resumo da página de projeto no desktop. No celular, cai para o corpo.
- **Corpo** (Atkinson 400, altura de linha 1.45; 1.4 na linha da home, 1.55 no texto do Sobre): a linha de posicionamento (até 30ch no celular e 26rem no desktop), o resumo no celular e os parágrafos do Sobre (até 38rem).
- **UI** (Atkinson 400): o tamanho base da página. Cabeçalho, lista de serviços, texto do serviço, legenda do tambor, e-mail e fichas.
- **Rótulo** (Atkinson 400, texto suave; peso 600 no Raso): "Serviços", "Contato", tipo e ano na legenda do tambor, termos das fichas, legenda do carrossel, assinatura e créditos dos modelos 3D. Sempre em caixa normal e sem espaçamento extra.
- **Ação** (Atkinson 600): o texto da pílula amarela e do link de pular.

### Named Rules
**A Regra do Display Único.** Anybody aparece só em títulos de página. Nada abaixo do título usa display, e nenhum rótulo vai para caixa alta.

**A Regra do Nome Vivo.** Com mouse e sem WebGL, as letras do nome afinam perto do ponteiro (num raio de 220px, a largura vai de 150% a 108% e o peso de 880 a 520). Com WebGL, quem reage é a pincelada. As duas respostas nunca rodam juntas.

## Layout

**Margem** (token margem) é a medida de borda de tudo: cabeçalho, textos, rodapés fixos, a ação fixa e as setas flutuantes do celular. O **cabeçalho** tem 3.5rem de referência, e o conteúdo do desktop começa 1.25rem abaixo dele.

**Home, desktop (1024px ou mais):** uma coluna rolável com moldura fixa. O nome e a linha ficam fixos à esquerda (42vw). O tambor rola numa coluna central (36vw a partir de 45.2vw, 1.75rem entre linhas, 42vh de folga no pé), e cada linha tem 4.6vw de respiro dos dois lados para as frestas. O painel "Serviços" fica fixo à direita, a 30vh do topo, com min(16rem, 16.5vw) de largura e tudo alinhado à direita. O rodapé fica fixo a 2rem da base, com contato à esquerda e assinatura à direita. O tambor tem no mínimo 3 linhas, com prévias onde faltar projeto.

**Home, celular e tablet (até 1023px):** tudo empilha na ordem cabeçalho, nome, linha, painel "Serviços" (2.75rem acima), tambor (2.25rem acima, 1.5rem entre linhas, 13% de respiro lateral) e rodapé. A pílula do WhatsApp fica fixa no canto inferior direito, e as setas de giro flutuam no canto inferior esquerdo enquanto o tambor estiver na tela e as setas do painel não. Até 640px, o cabeçalho quebra em duas linhas (função em cima, navegação embaixo).

**Página de projeto:** ocupa uma tela no desktop (100svh, com linhas de título, carrossel e rodapé). O título fica centralizado, o carrossel ocupa a largura toda com itens centrados e o rodapé tem três colunas (resumo, ficha em quatro colunas, próximo projeto ou contato). A altura do item é min(46svh, 32vw) no desktop e 52vw no celular. Prints de desktop medem altura × 1.6 de largura e prints de celular medem altura × 0.462.

**Sobre:** duas colunas no desktop (título e abertura em largura total, texto à esquerda, ficha à direita, rodapé em largura total), com 4vw entre colunas e 2rem entre linhas. No celular, uma coluna com 2.5rem entre blocos.

**Ritmo:** 2rem separa blocos dentro de um rodapé e 3rem separa seções empilhadas no celular. Dentro de grupos pequenos (rótulo e valor), a distância é 0.15rem.

**Sob o cabeçalho fixo:** a coluna da home passa por baixo do cabeçalho sem cobrir os links. Com WebGL, os prints somem suaves em 28px logo abaixo dele (12px de folga). As legendas, que são texto, somem em 350ms ao encostar. Sem água, o cabeçalho do desktop ganha o fundo da profundidade.

## Elevation & Depth

Não há sombras nem camadas levantadas. A profundidade é literal: quatro níveis de água, trocados por cor de fundo e, com WebGL, por uma superfície que sobe pela tela. O conteúdo fica sempre no mesmo plano (`main` no z-index 2). O canvas da água fica atrás dele (z-index 1, sem receber ponteiro). A onda do rodapé fica no nível do canvas, abaixo do conteúdo.

Dentro do canvas, a ordem de desenho é fixa: a água ao fundo (−1), os tubarões na névoa, o atum, os prints (1), os títulos (2) e a camada de textos (3). Os peixes ficam atrás do trabalho e de qualquer letra: aparecem nos espaços livres e somem atrás das capas e dos prints.

Dentro da água, a profundidade vem da luz: cáusticas contidas (intensidade 0.1, reduzidas no Fundo e apagadas no Abismo), neve marinha em três camadas, feixes de luz só no Fundo e uma faixa mais clara logo abaixo da linha d'água enquanto ela sobe. Embaixo d'água, os prints ganham uma tinta verde (de 28% a 48%) e cáusticas por cima. No Abismo, os prints caem para 78% de luz, como se iluminados de perto.

O tambor da home é a única peça com volume. As faces giram em perspectiva, e a que sai de frente escurece (até 70%) e borra (até 7px) conforme vira. Isso é luz sobre um objeto, não elevação: nada ganha sombra projetada.

### Named Rules
**A Regra da Profundidade Nomeada.** Todo estado de água corresponde a um nome (Superfície, Raso, Fundo, Abismo), que fica salvo no `localStorage`, aparece no parâmetro da URL e está marcado com `aria-pressed` no controle. A água pode passar por valores intermediários durante a descida, mas sempre assenta num nível nomeado.

**A Regra do Plano Único.** Nada flutua sobre nada. Não use sombra, painel translúcido ou cartão para separar conteúdo. Quem separa é o espaço, o fio ou a água. O giro do tambor é geometria, não camada.

**A Regra do Peixe no Fundo.** Toda vida 3D do Abismo fica atrás do trabalho e do texto. O atum e os tubarões nunca cobrem uma capa, um print ou uma palavra, porque o cliente precisa ver as demonstrações. Pedido do Nicolas em 13/09/2026.

## Shapes

As formas são retas por padrão. Imagens do carrossel, capas do próximo projeto e espaços de carregamento têm cantos vivos e cortam com `overflow: hidden`. As capas usam 16:10 e os prints de celular usam proporção de tela.

Três exceções arredondam, cada uma com um papel: as faces do tambor (canto de face, pedido pelo Nicolas no rascunho e recortado também no shader), as setas de giro (círculo com borda de 1.5px) e a pílula da ação principal. O anel de foco tem 2px de raio.

As curvas do sistema vêm da água: a onda do rodapé, a linha d'água ondulada que sobe, o carrossel côncavo embaixo d'água, o rasgo orgânico da pincelada e o tambor, que estreita 9% perto do topo e da base da tela.

Os ícones são SVG num quadro de 16, com traço de 1.5 e ponta quadrada: seta diagonal, seta esquerda, seta direita, giro esquerda e giro direita (arco com ponta, no desenho do rascunho) e lanterna.

## Components

### Cabeçalho
Discreto, em texto UI, sem fundo.
- **Estrutura:** à esquerda, a função ("Creative developer em Aracaju") na home e o nome como link nas outras páginas, mais "← Índice" (ícone de seta) na página de projeto. À direita, Sobre, PT/EN (idioma atual como texto e o outro como link, separados por uma barra suave) e o controle de profundidade.
- **Posição:** fixo no topo a partir de 1024px. Abaixo disso, fica no fluxo da página. Até 640px, empilha em duas linhas.
- **Links:** sem sublinhado em repouso. Um fio de 1px em `currentColor` cresce da esquerda em 350ms ao passar o mouse, ao focar ou em `aria-current="page"`.

### Controle de profundidade
A assinatura de navegação: três palavras, uma lanterna e uma linha amarela.
- **Estilo:** botões de texto "Superfície", "Raso" e "Fundo", separados por 0.9rem, e a lanterna em ícone (quadro de 1.35rem, ícone de 1rem) com rótulo acessível "Abismo (modo escuro)". O nível ativo e o hover usam a cor do texto, e os inativos usam o texto suave (300ms).
- **Lanterna:** funciona como botão de modo escuro. Fora do Abismo, leva até ele. No Abismo, volta para a Superfície.
- **Linha d'água:** um traço amarelo de 3px sob o nível ativo, inclusive sob a lanterna, que desliza e muda de largura em 600ms com a curva da água.
- **Comportamento:** com WebGL, o clique pede a descida contínua (2.2s, `power2.inOut`). Sem WebGL, troca por View Transition. Com movimento reduzido, troca na hora. Atualiza o `theme-color` com o fundo de cada nível.
- **Sem JavaScript:** o controle não aparece.

### Tambor de serviços
A porta de entrada da home. Cada linha é um prisma de quatro faces, uma por serviço: Creative & Immersive, E-commerce, SaaS e Landing Pages.
- **Geometria:** em repouso, a face da frente fica chapada e as vizinhas ficam a 68°, só como frestas. Entre as faces há um vão de 6% da largura. Cada linha tem a própria perspectiva, com o olho a 2.2 larguras de face, para as duas frestas saírem iguais em qualquer ponto da tela. A face que passa da fresta para trás some (entre 1.08 e 1.4 de distância) antes de virar um risco.
- **Face:** só a capa de um projeto, em 16:10, com cantos de 10px e a mesma mídia em duas cores com granulado. Na fresta, aparece só o tom borrado da vizinha, sem texto esmagado. No meio do giro, com WebGL, uma faixa de sol atravessa a face (16%).
- **Giro:** 1.2s em `power3.inOut`, com 85ms de cascata entre linhas. O ciclo volta ao primeiro serviço. Com movimento reduzido, é imediato.
- **Controles:** setas de giro no painel, lista de serviços (pelo caminho mais curto), setas ← e → do teclado, arrasto lateral no toque (a partir de 48px), deslize lateral no trackpad e clique numa fresta.
- **Legenda:** embaixo de cada linha, o nome do projeto em texto UI e "tipo · ano" em rótulo. Troca com fade e subida de 0.35rem (450ms e 650ms, entrando 180ms depois).
- **Prévias:** onde falta projeto, entra uma imagem escura "Projeto prévia N", com a legenda "Espaço pro próximo projeto de X". Nunca promete prazo. Sai quando o projeto chega.
- **Estado:** a home abre no primeiro serviço que tem projeto de verdade e lembra o último escolhido na sessão. Só a face de frente recebe foco e atravessa para a página do projeto. Um `aria-live` anuncia o serviço.

### Painel "Serviços"
- **Estrutura:** rótulo "Serviços" e as duas setas de giro na mesma linha, a lista de serviços embaixo e o texto do serviço de frente por último (até 34ch, texto suave). Os textos dividem a mesma célula, então a altura não pula.
- **Lista:** os serviços inativos ficam a 55% de opacidade e voltam a 100% no hover e no foco. O serviço de frente ganha o traço amarelo de 1rem × 3px, que abre em 600ms a partir do lado do texto.
- **Texto do serviço:** troca com fade e subida de 0.4rem (500ms e 700ms, entrando 120ms depois).

### Setas de giro
- **Forma:** círculo de 2.75rem com borda de 1.5px na cor do texto, fundo transparente e ícone de giro de 1.25rem.
- **Hover:** enche com a cor do texto e inverte o ícone (300ms). **Ao apertar:** encolhe para 92%.
- **Celular:** as mesmas setas flutuam no canto inferior esquerdo, com o fundo da profundidade, entrando com fade e subida de 0.75rem (400ms e 600ms).

### Mídia em preto e branco com granulado
As capas das faces do tambor e do próximo projeto.
- **Superfície:** a imagem-base fica em tons de cinza (contraste 1.08, brilho 1.03) sob um granulado de 128px em `overlay` a 30%, que treme em 5 passos a cada 0.5s. Uma segunda cópia colorida fica por cima, mascarada por um círculo que segue o ponteiro.
- **Com WebGL:** a imagem do DOM fica invisível e só guarda o lugar. O plano em WebGL mapeia a luminância entre tinta e sol, com granulado forte animado a 24 quadros. A cor aparece onde a pincelada rasgou, com borda nítida, espuma clara, leve separação cromática e refração do fluxo.
- **Raso, Fundo e Abismo:** a cor aparece inteira, sem granulado. No Fundo e no Abismo, com WebGL, a pincelada devolve a imagem ao preto e branco com granulado, como era na superfície.
- **Carregando:** o espaço mostra a cor do fio da profundidade.

### Carrossel da página de projeto
Os prints do trabalho, em cor cheia em todas as profundidades.
- **Trilho:** rolagem horizontal sem barra, sem repetição infinita, com itens centralizados e espaço de clamp(0.75rem, 1.4vw, 1.6rem) entre eles. A região tem `aria-roledescription="carrossel"` e recebe foco.
- **Roda do mouse:** a roda vertical anda o trilho (1.2× o deslocamento) até o último print. Só depois disso a roda passa a descer a água. Voltando, o trilho recua até o primeiro antes de subir.
- **Desktop com mouse:** Lenis horizontal (lerp 0.075), arraste com cursor de mão (1.3× o deslocamento) e setas, Home e End pelo teclado. Ao parar por 180ms, encaixa no item mais perto em 1.3s. Sem WebGL, o trilho inclina com a velocidade (até ±4°). Com WebGL, quem entorta é o shader: os prints se esticam com a velocidade.
- **Embaixo d'água:** com WebGL, o carrossel fica côncavo, como o lado de dentro de um cilindro: as bordas vêm para a frente. A curva cresce com a profundidade e chega ao máximo pouco antes do Fundo.
- **Toque ou movimento reduzido:** rolagem nativa, com encaixe obrigatório no celular.
- **Legenda:** um rótulo centralizado (até 52ch) que troca com fade de 300ms quando outro item chega ao centro.
- **Transição:** o primeiro quadro recebe a capa da face de frente ao atravessar de página.

### Contato
E-mail e WhatsApp, sempre juntos.
- **E-mail:** rótulo "Contato" e o endereço como botão. O clique copia o e-mail, e o aviso de sucesso ou falha ocupa o lugar do rótulo por 2.4s (`role="status"`). Se a cópia falhar, o texto do endereço fica selecionado.
- **WhatsApp:** a ação principal, uma pílula amarela com texto tinta em peso 600 e seta diagonal. No hover, o amarelo clareia em 250ms. Continua no DOM e amarela em todas as profundidades, inclusive sob a camada de textos em WebGL.
- **Até 1023px (home e Sobre):** a pílula fica fixa no canto inferior direito, com borda de 1.5px em tinta.
- **Projeto sem próximo:** o contato ocupa a terceira coluna do rodapé, alinhado à direita.

### Linha d'água
O único grafismo recorrente.
- **Em repouso (só na Superfície):** uma onda em SVG de 16px de altura, com traço amarelo de 4.5px e ponta redonda, a 2px da base da tela. Tem o dobro da largura da tela e anda para a esquerda num ciclo de 14s. Some em 500ms fora da Superfície ou durante a descida.
- **Na descida com WebGL:** uma linha amarela ondulada, desenhada no shader, acompanha a superfície da água enquanto ela sobe pela tela. As ondas só aparecem no meio da subida.
- **Na troca sem WebGL:** um fio amarelo de 3px atravessa a tela da base ao topo (ou ao contrário) em 1100ms, junto com o recorte da View Transition.
- **Na navegação:** o traço sob o nível ativo e a marca do serviço de frente usam a mesma cor e a mesma espessura de 3px.

### Link de pular para o conteúdo
Uma etiqueta amarela com texto tinta em peso 600, escondida acima da tela. Aparece na margem quando recebe foco.

### Pincelada: janela para a superfície
No Fundo e no Abismo, o rastro do ponteiro inverte o mundo em vez de revelar a água.
- **Fundo:** dentro do rastro, a água vira sol.
- **Textos:** com WebGL, os textos do cabeçalho e do conteúdo são redesenhados numa camada própria (ordem 3), e o DOM fica com o preenchimento transparente, mas presente para leitura, seleção e links. Fora do rastro, a camada usa a cor do texto e do rótulo da profundidade. Dentro, usa tinta e tinta suave, com uma franja de 2px (proporcional a 1440px de largura) amarela de um lado e verde-mar do outro. Os títulos em display e a ação amarela ficam fora dessa camada.
- **Prints:** dentro do rastro, voltam ao preto e branco com granulado.
- **Limiar:** a troca acontece na metade entre Raso e Fundo (de 1.45 a 1.55).

### Abismo
A quarta profundidade: o mesmo mar, muito fundo.
- **Água:** o tom abismo, um pouco mais claro no alto da tela, sem cáusticas nem feixes, com névoa e granulado de 2%.
- **Neve marinha:** três camadas de flocos irregulares. A de perto é grande e desfocada, a do meio é nítida e a de longe é miúda. Afundam devagar, balançam de lado, cintilam e sobem quando você desce. Também existem, mais fracas, no Raso e no Fundo.
- **Lanterna:** um halo frio e fraco segue o ponteiro com atraso e acende os flocos por perto (até 1.8× mais brilho). Uma luz pontual fria acompanha o ponteiro e ilumina o atum quando ele chega perto.
- **Atum:** modelo 3D estilizado, de 170 unidades, no verde do atum com contorno de luz fria. Persegue o ponteiro com o nariz na frente, arranca de longe e desliza de perto (de 60 a 480 por segundo), nunca para e nunca dá ré. Vira numa curva em U pela frente da câmera, inclinando o corpo, e bate a cauda mais rápido quando acelera. Sem ponteiro, vagueia num oito largo.
- **Tubarões:** dois modelos de 520 unidades, com o tom puxado para o verde-mar, cruzam a névoa bem atrás de tudo (de 900 a 1800 unidades de distância), em lados e alturas sorteados, com pausas de 3 a 11s.
- **Carga:** os modelos (Fab, com créditos no Sobre) só carregam na primeira vez que o Abismo abre.

### Movimento

**Entrada em marola.** As letras dos títulos sobem de 115% dentro de uma máscara em 1.5s (`expo.out`). O atraso de cada letra vale `i × 0.032 + sin(i × 0.85) × 0.025`, uma ondulação que passa pelo nome. A máscara tem 0.2em de folga em cima para não cortar Ã e É. Linhas de parágrafo sobem de 105% em 1.3s, com 0.07s entre elas. As peças comuns sobem 14px com fade em 1.1s. As linhas do tambor se revelam de baixo para cima por recorte em 1.6s, com 0.1s entre elas. Os prints seguintes do carrossel deslizam 80px em 1.4s. Tudo começa depois de 0.45s mais o atraso de cada peça. Se o script não confirmar em 3s, tudo aparece parado.

**Saída.** As letras sobem para fora em 0.55s e as peças somem subindo 10px em 0.4s (`power3.in`). A imagem clicada não sai: ela atravessa para a próxima página por View Transition (1100ms, curva da água).

**Pincelada de fluido.** Um fluido estável na GPU (grade de 112 para velocidade e 384 para tinta, 14 iterações de pressão, com vorticidade). O movimento do ponteiro ou do dedo vira um único respingo por quadro, com tinta proporcional à rapidez (de 0.05 até 0.32). Ponteiro parado não rasga nada. Na Superfície, a tinta abre um rasgo com borda nítida (limiar 0.06 a 0.11) que mostra a água calma e a cor dos prints. No Fundo e no Abismo, abre a janela para a superfície. A simulação para 3.5s depois do último respingo.

**Descida contínua.** A profundidade é um número de 0 a 3. Quando a página chega ao fim, a roda do mouse ou o toque continuam descendo (900px por nível). Quando chega ao topo, sobem. Ao soltar, a água assenta no nível mais perto, e basta 20% de empurrão para seguir na direção do gesto. A linha d'água sobe de −8% a 108% da tela entre Superfície e Raso, e nesse trecho os rótulos passam a tinta cheia. O tema do texto troca em 1.5 (Fundo) e em 2.5 (Abismo). Sem WebGL, cada gesto de pelo menos 260px de rolagem troca um nível.

**Transições de tema.** O fundo e o texto da página mudam de cor em 400ms com a curva da água (`cubic-bezier(0.22, 1, 0.36, 1)`), que é a curva padrão de todas as transições de estado em CSS.

### Camada WebGL

- **Requisito:** WebGL2. O teste é feito antes de carregar o módulo, que só chega por import dinâmico.
- **Ordem de carga:** a camada clara vem primeiro. Com mouse, a água carrega no primeiro momento ocioso (até 1.5s). No toque, acorda no primeiro toque, rolagem ou tecla, ou depois de 6s.
- **Um canvas só:** fixo, atrás do conteúdo, transparente e sem receber ponteiro. Persiste entre páginas. Densidade de pixels limitada a 1.75 (2 para a textura do nome).
- **O DOM continua dono do conteúdo:** imagens, nome e textos ficam no DOM, legíveis e selecionáveis. O plano em WebGL só assume quando a textura está pronta e a animação de entrada acabou. O nome só vai para o WebGL se o canvas 2D souber esticar a Anybody (`fontStretch`), senão fica no DOM.
- **Tambor no WebGL:** as faces usam a mesma geometria do CSS (`tambor.ts`). Os vértices andam no shader, e os cantos de 10px são recortados por distância.
- **Troca de página:** o canvas some e os planos são desmontados antes da navegação. Eles voltam quando a View Transition termina (ou 1150ms depois).
- **Contexto perdido:** a água é desmontada e o site passa para o modo sem água.

### Fallbacks

- **Sem JavaScript:** o controle de profundidade some. Nada fica escondido esperando animação.
- **Sem WebGL:** as capas mantêm a revelação de cor pelo CSS e o tambor gira em CSS 3D com as mesmas contas. A troca de profundidade vira a água subindo por recorte de View Transition, com o fio amarelo de 3px acompanhando (1100ms), e a roda troca um nível por gesto. O carrossel inclina pelo GSAP. O nome afina perto do mouse. O cabeçalho fixo ganha fundo para tapar a coluna.
- **Movimento reduzido:** sem água, sem entrada, sem nome reativo, sem granulado animado e sem rolagem suave no carrossel. O tambor gira na hora. Toda transição e animação cai para 1ms, a troca de profundidade é imediata e a roda não muda a profundidade.
- **Toque (`hover: none`):** sem água, a cor de cada capa chega em 1200ms quando 55% dela entra na tela. Com água, a capa espera o dedo mexer. O tambor gira pelo arrasto lateral e pelas setas flutuantes, o carrossel usa rolagem nativa com encaixe e o WhatsApp fica fixo na base.

### Exceções registradas (pedidas pelo Nicolas)

- **Carrossel em cor cheia na Superfície.** O preto e branco com granulado vale para as capas (tambor e próximo projeto). O carrossel da página de projeto mostra o trabalho em cor, inclusive no WebGL.
- **Topo da home com a função.** Na home, o canto esquerdo do cabeçalho mostra "Creative developer em Aracaju" em vez do nome, porque o título gigante já é o nome. Nas outras páginas, o nome volta como link.
- **Abismo, o modo escuro.** A recusa ao fundo escuro não vale na quarta profundidade, que continua sendo mar, com neve marinha, lanterna e peixes 3D.
- **Pincelada que inverte no Fundo e no Abismo.** Dentro do rastro, aparecem o sol, o texto em tinta com franja amarela e verde-mar, e os prints em preto e branco com granulado.
- **Roda no carrossel.** A roda anda o trilho até o fim antes de mover a água, sem carrossel infinito.
- **Tambor de serviços no lugar da coluna de capas e do índice.** Faces separadas por um vão e com cantos arredondados, giradas por setas curvas, no desenho do rascunho.
- **Valores fora da escala principal.** O título do projeto no celular (tamanho fluido de 2.4rem a 6rem) e o resumo do desktop (1.125rem) são passos próprios da página de projeto. O hover amarelo claro e as duas cores do atum são tokens de uso único: pertencem à ação principal e ao Abismo, e não servem para outra coisa.

## Do's and Don'ts

### Do:
- **Do** tire fundo, texto, texto suave e fio das variáveis da profundidade, para que qualquer superfície nova funcione em Superfície, Raso, Fundo e Abismo sem código extra.
- **Do** use o amarelo pino (#FFD23F) só na linha d'água e na ação principal, com texto em tinta por cima.
- **Do** coloque toda capa de projeto nova dentro da mídia em duas cores com granulado, a menos que ela seja um print do carrossel.
- **Do** dê a cada projeto novo uma categoria de serviço, para ele ocupar uma face do tambor sem mudança de layout.
- **Do** use a curva da água (`cubic-bezier(0.22, 1, 0.36, 1)`) e durações a partir de 250ms em toda transição de estado.
- **Do** mantenha o DOM completo e legível por baixo de qualquer coisa desenhada em WebGL, e dê a toda interação de água um equivalente sem WebGL, com movimento reduzido e no toque.
- **Do** ancore bordas na margem (clamp(1rem, 1.6vw, 1.5rem)) e deixe o layout funcionar com um único projeto.
- **Do** mantenha o CSS e o WebGL do tambor na mesma geometria (`tambor.ts`), para a face girar igual nos dois.

### Don't:
- **Don't** use cards, painéis, sombras ou fundos translúcidos para agrupar conteúdo. A página não tem camadas levantadas.
- **Don't** leve cor saturada para a interface da Superfície fora dos prints. O verde-mar só aparece junto com a água.
- **Don't** use fundo escuro fora do Abismo, nem faça do Abismo um tema neutro sem água.
- **Don't** use Anybody fora dos títulos de página nem ponha rótulos em caixa alta.
- **Don't** arredonde cantos fora das faces do tambor, das setas de giro e da pílula da ação.
- **Don't** deixe um peixe ou qualquer objeto 3D passar por cima de texto.
- **Don't** faça um movimento que pule, quique ou apareça de repente. A água entra por recorte, sobe ou desliza, e o tambor gira em cascata.
- **Don't** faça o conteúdo depender do WebGL, nem faça o visitante esperar a água carregar para ver a página.
- **Don't** repita o nome em tamanho grande e pequeno na mesma tela.
- **Don't** prometa prazo nas prévias do tambor.
