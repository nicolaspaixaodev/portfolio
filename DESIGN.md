---
name: Nicolas Paixão
description: Portfólio de creative developer. Mar raso da Orla de Atalaia ao meio-dia, com página editorial ao sol e água em WebGL por baixo.
colors:
  sol: "#F6F8F7"
  tinta: "#0B1F24"
  tinta-suave: "#4A5F64"
  verde-mar: "#1FA396"
  fundo: "#0D5E6B"
  brilho: "#EFFFF8"
  brilho-suave: "#A8DAD2"
  pino: "#FFD23F"
  fio-superficie: "rgb(11 31 36 / 0.16)"
  fio-raso: "rgb(11 31 36 / 0.24)"
  fio-fundo: "rgb(239 255 248 / 0.22)"
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
  abertura:
    fontFamily: "Atkinson Hyperlegible Next Variable, Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.5vw, 2.35rem)"
    fontWeight: 400
    lineHeight: 1.22
    letterSpacing: "-0.01em"
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
  profundidade-linha:
    backgroundColor: "{colors.pino}"
    height: "3px"
  indice-marca:
    backgroundColor: "{colors.pino}"
    width: "1rem"
    height: "3px"
  indice-previa:
    width: "min(16rem, 22vw)"
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

O site é o mar raso da Orla de Atalaia ao meio-dia. Em cima fica uma página editorial clara, em sol e tinta, com o nome em Anybody larga e pesada e os prints desbotados pelo sol. Embaixo há água verde-mar em WebGL, que aparece em três profundidades nomeadas (Superfície, Raso e Fundo). O ponteiro rasga a superfície e mostra a água. Descer afunda a página inteira, e a linha d'água amarela marca onde a água está.

A densidade é baixa e editorial. Não há cards, painéis nem sombras. Os prints ficam soltos, os rótulos são pequenos e a linha d'água em amarelo pino é o único grafismo recorrente. A cor forte fica dentro dos prints. Na superfície, a interface usa só sol, tinta e pino, e o verde-mar só aparece quando a água aparece.

O movimento tem o ritmo da água rasa: lento, ondulado e refratado, sem pulo nem quique. A camada clara carrega primeiro e funciona inteira sem a água. O WebGL entra depois, por cima dela, e nunca é condição para ler, navegar ou chamar.

**Key Characteristics:**
- Três profundidades nomeadas e linkáveis (`?profundidade=superficie|raso|fundo`), cada uma com fundo, texto e fio próprios.
- Nome em Anybody a 150% de largura e peso 880, em caixa alta, com entrada em marola.
- Capas em duas cores (tinta a sol) com granulado, que ganham cor sob o ponteiro ou embaixo d'água.
- Linha d'água amarela: ondula no pé da tela, marca o nível ativo, marca o projeto ativo no índice e sobe com a água.
- Fluido real na GPU. A pincelada abre um rasgo de borda nítida que revela a água e a cor.
- Fallbacks completos para quem não tem WebGL, prefere movimento reduzido ou usa toque.

## Colors

Uma paleta de luz de meio-dia: branco quente de sol, tinta petróleo quase preta, duas águas e um único amarelo.

### Primary
- **Amarelo Sol a Pino** (pino): a única cor saturada da interface. Aparece só na ação principal (WhatsApp), na linha d'água (onda do rodapé, traço do nível ativo, marca do índice, linha que sobe com a água), na seleção de texto, no link de pular para o conteúdo e na franja da pincelada sobre o nome. Nunca é fundo de área nem cor de texto.

### Secondary
- **Verde-Mar do Raso** (verde-mar): o fundo da profundidade Raso e a cor base da água em WebGL. Também aparece como a franja verde da pincelada sobre o nome. Na superfície, só surge dentro do rasgo aberto pelo ponteiro.
- **Fundo Petróleo** (fundo): o fundo da profundidade Fundo. No shader, a água passa do verde-mar para ele conforme a descida vai de Raso a Fundo.

### Neutral
- **Sol** (sol): o fundo da Superfície e o tom claro das capas em duas cores.
- **Tinta** (tinta): o texto na Superfície e no Raso, o tom escuro das capas em duas cores, o texto da ação amarela e a borda da ação fixa no celular.
- **Tinta Suave** (tinta-suave): rótulos, a barra do PT/EN e os níveis inativos, só na Superfície. No Raso, rótulos passam a tinta cheia com peso 600, porque ficam sobre cáusticas.
- **Brilho** (brilho): o texto no Fundo. Na água em WebGL, é a cor da luz (cáusticas, partículas, feixes, espuma) e do nome dentro da pincelada.
- **Brilho Suave** (brilho-suave): rótulos e níveis inativos no Fundo.
- **Fios** (fio-superficie, fio-raso, fio-fundo): a cor que ocupa o espaço da imagem enquanto ela carrega. Muda com a profundidade.

A areia molhada (#C9B48A) do contrato de direção está declarada como `--areia` em `global.css`, mas nenhuma superfície entregue a usa. Por isso não entrou como token.

### Named Rules
**A Regra da Cor Presa.** Fora dos prints, a Superfície usa só sol, tinta e pino. A cor saturada do trabalho mora dentro das imagens e só escapa quando a água a revela.

**A Regra do Amarelo Único.** O pino marca só duas coisas: onde a água está e a ação principal. Um terceiro uso dilui os dois.

**A Regra da Troca por Profundidade.** Fundo, texto, texto suave e fio vêm das variáveis da profundidade (`--bg`, `--fg`, `--fg-2`, `--fio`), nunca de um hex direto no componente. A exceção é o pino, que vale igual nas três profundidades.

## Typography

**Display Font:** Anybody Variable (com Anybody e system-ui como fallback)
**Body Font:** Atkinson Hyperlegible Next Variable (com Atkinson Hyperlegible Next e system-ui como fallback)

**Character:** Um display largo e pesado, de placa de orla, contra um texto feito para ser lido no sol do celular. O display grita o nome, e todo o resto fala baixo.

### Hierarchy
- **Display** (Anybody, peso 880, largura 150%, caixa alta, altura de linha 0.9, espaçamento -0.01em, `text-wrap: balance`): só o nome na home, o nome do projeto e "Sobre". O nome da home ocupa a coluna esquerda no desktop (min(6.1vw, 6rem), 42vw) e a largura inteira no celular, em duas linhas (largura útil ÷ 7.5). O título do projeto fica centralizado (min(4.9vw, 6rem) no desktop, clamp(2.4rem, 10vw, 6rem) no celular). "Sobre" usa min(11vw, 6rem) no desktop e largura útil ÷ 3.6 no celular.
- **Abertura** (Atkinson 400, clamp(1.4rem, 2.5vw, 2.35rem), altura de linha 1.22, até 28ch): o primeiro parágrafo do Sobre, que entra linha por linha.
- **Corpo** (Atkinson 400, 1.0625rem, altura de linha 1.45; 1.55 no texto do Sobre): a linha de posicionamento (até 30ch no celular e 26rem no desktop), o resumo do projeto (até 34rem, 1.125rem no desktop) e os parágrafos do Sobre (até 38rem).
- **UI** (Atkinson 400, 0.9375rem, altura de linha 1.45): o tamanho base do corpo da página. Usado em cabeçalho, índice, e-mail e fichas.
- **Rótulo** (Atkinson 400, 0.8125rem, texto suave; peso 600 no Raso): "Índice", "Contato", termos das fichas (Ano, Tipo, Função, Visitar), legenda do carrossel e assinatura "Aracaju, SE · © 2026". Sempre em caixa normal e sem espaçamento extra.
- **Ação** (Atkinson 600, 0.9375rem): o texto da pílula amarela e do link de pular.

### Named Rules
**A Regra do Display Único.** Anybody aparece só em títulos de página. Nada abaixo do título usa display, e nenhum rótulo vai para caixa alta.

**A Regra do Nome Vivo.** Com mouse e sem WebGL, as letras do nome afinam perto do ponteiro (num raio de 220px, a largura vai de 150% a 108% e o peso de 880 a 520). Com WebGL, quem reage é a pincelada. As duas respostas nunca rodam juntas.

## Layout

**Margem** (clamp(1rem, 1.6vw, 1.5rem)) é a medida de borda de tudo: cabeçalho, textos, rodapés fixos e a ação fixa do celular. O **cabeçalho** tem 3.5rem de referência, e o conteúdo do desktop começa 1.25rem abaixo dele.

**Home, desktop (1024px ou mais):** a página é uma coluna rolável com moldura fixa. O nome e a linha ficam fixos à esquerda (42vw). As capas rolam numa coluna central (32vw a partir de 47vw, 1rem entre elas, 45vh de folga no pé). O índice fica fixo à direita, a 38vh do topo, com 15vw de largura. O rodapé fica fixo a 2rem da base, com contato à esquerda e assinatura à direita. Com menos de 3 projetos, a coluna vira uma capa em pé de 4:5, centralizada na faixa da coluna e limitada pela altura da tela.

**Home, celular e tablet (até 1023px):** tudo empilha na ordem cabeçalho, nome, linha, capa (16:10), índice, contato e assinatura. O índice alinha à esquerda e perde a prévia. A pílula do WhatsApp fica fixa no canto inferior direito. Até 640px, o cabeçalho quebra em duas linhas (função em cima, navegação embaixo).

**Página de projeto:** ocupa uma tela no desktop (100svh, com linhas de título, carrossel e rodapé). O título fica centralizado, o carrossel ocupa a largura toda com itens centrados e o rodapé tem três colunas (resumo, ficha em quatro colunas, próximo projeto ou contato). A altura do item é min(46svh, 32vw) no desktop e 52vw no celular. Prints de desktop medem altura × 1.6 de largura e prints de celular medem altura × 0.462.

**Sobre:** duas colunas no desktop (título e abertura em largura total, texto à esquerda, ficha à direita, rodapé em largura total), com 4vw entre colunas e 2rem entre linhas. No celular, uma coluna com 2.5rem entre blocos.

**Ritmo:** 2rem separa blocos dentro de um rodapé e 3rem separa seções empilhadas no celular. Dentro de grupos pequenos (rótulo e valor), a distância é 0.15rem.

## Elevation & Depth

Não há sombras nem camadas levantadas. A profundidade é literal: três níveis de água, trocados por cor de fundo e, com WebGL, por uma superfície que sobe pela tela. O conteúdo fica sempre no mesmo plano (`main` no z-index 2). O canvas da água fica atrás dele (z-index 1, sem receber ponteiro). A onda do rodapé fica no mesmo nível do canvas, abaixo do conteúdo.

Dentro da água, a profundidade vem da luz: cáusticas contidas (intensidade 0.1, reduzida no Fundo), partículas em suspensão que sobem quando você desce, feixes de luz só no Fundo e uma faixa mais clara logo abaixo da linha d'água enquanto ela sobe. Embaixo d'água, os prints ganham uma tinta verde (de 28% a 48%) e cáusticas por cima.

### Named Rules
**A Regra da Profundidade Nomeada.** Todo estado de água corresponde a um nome (Superfície, Raso, Fundo), que fica salvo no `localStorage`, aparece no parâmetro da URL e está marcado com `aria-pressed` no controle. A água pode passar por valores intermediários durante a descida, mas sempre assenta num nível nomeado.

**A Regra do Plano Único.** Nada flutua sobre nada. Não use sombra, painel translúcido ou cartão para separar conteúdo. Quem separa é o espaço, o fio ou a água.

## Shapes

As formas são retas. Imagens, quadros do carrossel e prévias têm cantos vivos e cortam com `overflow: hidden`. As capas usam 16:10 (ou 4:5 na exceção da home) e os prints de celular usam proporção de tela. A única forma arredondada é a pílula da ação principal (999px). O anel de foco tem 2px de raio. As curvas do sistema vêm da água: a onda do rodapé, a linha d'água ondulada que sobe, o arco do carrossel embaixo d'água e o rasgo orgânico da pincelada. Os ícones são três setas em SVG com traço de 1.5 e ponta quadrada (diagonal, esquerda e direita).

## Components

### Cabeçalho
Discreto, em texto UI, sem fundo.
- **Estrutura:** à esquerda, a função ("Creative developer em Aracaju") na home e o nome como link nas outras páginas, mais "← Índice" na página de projeto. À direita, Sobre, PT/EN (idioma atual como texto e o outro como link, separados por uma barra suave) e o controle de profundidade.
- **Posição:** fixo no topo a partir de 1024px. Abaixo disso, fica no fluxo da página. Até 640px, empilha em duas linhas.
- **Links:** sem sublinhado em repouso. Um fio de 1px em `currentColor` cresce da esquerda em 350ms ao passar o mouse, ao focar ou em `aria-current="page"`.

### Controle de profundidade
A assinatura de navegação: três palavras e uma linha amarela.
- **Estilo:** botões de texto "Superfície", "Raso" e "Fundo", separados por 0.9rem. O nível ativo e o hover usam a cor do texto, e os inativos usam o texto suave (transição de 300ms).
- **Linha d'água:** um traço amarelo de 3px sob o nível ativo, que desliza e muda de largura até o próximo em 600ms com a curva da água.
- **Comportamento:** com WebGL, o clique pede a descida contínua (2.2s, `power2.inOut`). Sem WebGL, troca por View Transition. Com movimento reduzido, troca na hora. Atualiza o `theme-color` (#F6F8F7, #1FA396, #0D5E6B).
- **Sem JavaScript:** o controle não aparece.

### Índice
Lista de projetos à direita, alinhada à direita.
- **Estrutura:** rótulo "Índice" e uma lista numerada de nomes em texto UI.
- **Marca ativa:** antes do nome ativo, um traço amarelo de 1rem × 3px abre da direita em 500ms. Na home, o ativo é o projeto no meio da tela (faixa central de 10% da altura) ou a capa sob o mouse.
- **Hover e foco:** os outros nomes caem para 45% de opacidade. A prévia (capa 16:10 em min(16rem, 22vw), mais a linha do projeto como rótulo) desce 1rem abaixo, abrindo por recorte de cima para baixo em 600ms. Passar o mouse no nome enche de cor a capa correspondente na coluna.
- **Até 1023px:** alinha à esquerda e fica sem prévia.

### Mídia em preto e branco com granulado
As capas da home e do "próximo projeto".
- **Superfície:** a imagem-base fica em tons de cinza (contraste 1.08, brilho 1.03) sob um granulado de 128px em `overlay` a 20%, que treme em 5 passos a cada 0.5s. Uma segunda cópia colorida fica por cima, mascarada por um círculo.
- **Mouse:** o círculo de cor abre no ponto de entrada até 42% do maior lado (1.4s, `expo.out`), segue o ponteiro com atraso de 0.9s e fecha em 1.1s ao sair.
- **Com WebGL:** a imagem do DOM fica invisível e só guarda o lugar. O plano em WebGL mapeia a luminância entre tinta e sol, com granulado forte animado a 24 quadros. A cor aparece onde a pincelada rasgou, com borda nítida, espuma clara, leve separação cromática e refração do fluxo.
- **Raso e Fundo:** a cor aparece inteira, sem granulado.
- **Carregando:** o espaço mostra a cor do fio da profundidade.

### Carrossel da página de projeto
Os prints do trabalho, em cor cheia em todas as profundidades.
- **Trilho:** rolagem horizontal sem barra, com itens centralizados e espaço de clamp(0.75rem, 1.4vw, 1.6rem) entre eles. A região tem `aria-roledescription="carrossel"` e recebe foco.
- **Desktop com mouse:** Lenis horizontal (lerp 0.075), arraste com cursor de mão (1.3× o deslocamento) e setas, Home e End pelo teclado. Ao parar por 180ms, encaixa no item mais perto em 1.3s. Sem WebGL, o trilho inclina com a velocidade (até ±4°). Com WebGL, quem entorta é o shader: os prints se esticam com a velocidade e, conforme a água sobe, se curvam em arco.
- **Toque ou movimento reduzido:** rolagem nativa, com encaixe obrigatório no celular.
- **Legenda:** um rótulo centralizado (até 52ch) que troca com fade de 300ms quando outro item chega ao centro.
- **Transição:** o primeiro quadro recebe a capa da home ao atravessar de página.

### Contato
E-mail e WhatsApp, sempre juntos.
- **E-mail:** rótulo "Contato" e o endereço como botão. O clique copia o e-mail, e o aviso de sucesso ou falha ocupa o lugar do rótulo por 2.4s (`role="status"`). Se a cópia falhar, o texto do endereço fica selecionado.
- **WhatsApp:** a ação principal, uma pílula amarela com texto tinta em peso 600 e seta diagonal. No hover, sobe 2px em 250ms.
- **Até 1023px (home e Sobre):** a pílula fica fixa no canto inferior direito, com borda de 1.5px em tinta.
- **Projeto sem próximo:** o contato ocupa a terceira coluna do rodapé, alinhado à direita.

### Linha d'água
O único grafismo recorrente.
- **Em repouso (só na Superfície):** uma onda em SVG de 16px de altura, com traço amarelo de 4.5px e ponta redonda, a 2px da base da tela. Tem o dobro da largura da tela e anda para a esquerda num ciclo de 14s. Some em 500ms fora da Superfície ou durante a descida.
- **Na descida com WebGL:** uma linha amarela ondulada, desenhada no shader, acompanha a superfície da água enquanto ela sobe pela tela. As ondas só aparecem no meio da subida.
- **Na troca sem WebGL:** um fio amarelo de 3px atravessa a tela da base ao topo (ou ao contrário) em 1100ms, junto com o recorte da View Transition.
- **Na navegação:** o traço sob o nível ativo e a marca do índice usam a mesma cor e a mesma espessura de 3px.

### Link de pular para o conteúdo
Uma etiqueta amarela com texto tinta em peso 600, escondida acima da tela. Aparece na margem quando recebe foco.

### Movimento

**Entrada em marola.** As letras dos títulos sobem de 115% dentro de uma máscara em 1.5s (`expo.out`). O atraso de cada letra vale `i × 0.032 + sin(i × 0.85) × 0.025`, uma ondulação que passa pelo nome. A máscara tem 0.2em de folga em cima para não cortar Ã e É. Linhas de parágrafo sobem de 105% em 1.3s, com 0.07s entre elas. As peças comuns sobem 14px com fade em 1.1s. As capas com `agua` se revelam de baixo para cima por recorte em 1.6s. Os prints seguintes do carrossel deslizam 80px em 1.4s. Tudo começa depois de 0.45s mais o atraso de cada peça. Se o script não confirmar em 3s, tudo aparece parado.

**Saída.** As letras sobem para fora em 0.55s e as peças somem subindo 10px em 0.4s (`power3.in`). A imagem clicada não sai: ela atravessa para a próxima página por View Transition (1100ms, curva da água).

**Pincelada de fluido.** Um fluido estável na GPU (grade de 112 para velocidade e 384 para tinta, 14 iterações de pressão, com vorticidade). O movimento do ponteiro ou do dedo vira um único respingo por quadro, com tinta proporcional à rapidez (de 0.05 até 0.32). Ponteiro parado não rasga nada. Na Superfície, a tinta abre um rasgo com borda nítida (limiar 0.06 a 0.11) que mostra a água calma e a cor dos prints. Sobre o nome, o rasgo clareia as letras para brilho e acende uma franja de 3px, amarela de um lado e verde-mar do outro. A simulação para 3.5s depois do último respingo.

**Descida contínua.** A profundidade é um número de 0 a 2. Quando a página chega ao fim, a roda do mouse ou o toque continuam descendo (900px por nível). Quando chega ao topo, sobem. Ao soltar por 650ms, a água assenta no nível mais perto, e basta 20% de empurrão para seguir na direção do gesto (assenta em 1.6s). A linha d'água sobe de −8% a 108% da tela entre Superfície e Raso. De Raso a Fundo, a cor escurece, e o tema do texto troca na metade (1.5). Sem WebGL, cada gesto de pelo menos 260px de rolagem troca um nível.

**Transições de tema.** O fundo e o texto da página mudam de cor em 400ms com a curva da água (`cubic-bezier(0.22, 1, 0.36, 1)`), que é a curva padrão de todas as transições de estado.

### Camada WebGL

- **Requisito:** WebGL2. O teste é feito antes de carregar o módulo, que só chega por import dinâmico.
- **Ordem de carga:** a camada clara vem primeiro. Com mouse, a água carrega no primeiro momento ocioso (até 1.5s). No toque, acorda no primeiro toque, rolagem ou tecla, ou depois de 6s.
- **Um canvas só:** fixo, atrás do conteúdo, transparente e sem receber ponteiro. Persiste entre páginas. Densidade de pixels limitada a 1.75 (2 para a textura do nome).
- **O DOM continua dono do conteúdo:** imagens e nome ficam no DOM, legíveis e selecionáveis. O plano em WebGL só assume quando a textura está pronta e a animação de entrada acabou, e a imagem do DOM fica transparente enquanto isso. O nome só vai para o WebGL se o canvas 2D souber esticar a Anybody (`fontStretch`), senão fica no DOM.
- **Troca de página:** o canvas some e os planos são desmontados antes da navegação. Eles voltam quando a View Transition termina (ou 1150ms depois).
- **Contexto perdido:** a água é desmontada e o site passa para o modo sem água.

### Fallbacks

- **Sem JavaScript:** o controle de profundidade some. Nada fica escondido esperando animação.
- **Sem WebGL:** as capas mantêm a revelação de cor pelo CSS. A troca de profundidade vira a água subindo por recorte de View Transition, com o fio amarelo de 3px acompanhando (1100ms), e a roda troca um nível por gesto. O carrossel inclina pelo GSAP. O nome afina perto do mouse.
- **Movimento reduzido:** sem água, sem entrada, sem nome reativo, sem granulado animado e sem rolagem suave no carrossel. Toda transição e animação cai para 1ms, a troca de profundidade é imediata e a roda não muda a profundidade.
- **Toque (`hover: none`):** sem água, a cor de cada capa chega em 1200ms quando 55% dela entra na tela. Com água, a capa espera o dedo mexer. O índice fica sem prévia, o carrossel usa rolagem nativa com encaixe e o WhatsApp fica fixo na base.

### Exceções registradas (pedidas pelo Nicolas)

- **Carrossel em cor cheia na Superfície.** O preto e branco com granulado vale para as capas (home e próximo projeto). O carrossel da página de projeto mostra o trabalho em cor, inclusive no WebGL.
- **Topo da home com a função.** Na home, o canto esquerdo do cabeçalho mostra "Creative developer em Aracaju" em vez do nome, porque o título gigante já é o nome. Nas outras páginas, o nome volta como link.
- **Capa 4:5 com menos de 3 projetos.** No desktop, enquanto houver menos de 3 projetos e o projeto tiver capa vertical, a coluna mostra a capa em pé, presa ao topo da imagem. A partir do 3º projeto, e sempre abaixo de 1024px, a capa é 16:10.

## Do's and Don'ts

### Do:
- **Do** tire fundo, texto, texto suave e fio das variáveis da profundidade, para que qualquer superfície nova funcione em Superfície, Raso e Fundo sem código extra.
- **Do** use o amarelo pino (#FFD23F) só na linha d'água e na ação principal, com texto em tinta por cima.
- **Do** coloque toda imagem de projeto nova dentro da mídia em duas cores com granulado, a menos que ela seja um print do carrossel.
- **Do** use a curva da água (`cubic-bezier(0.22, 1, 0.36, 1)`) e durações a partir de 250ms em toda transição de estado.
- **Do** mantenha o DOM completo e legível por baixo de qualquer coisa desenhada em WebGL, e dê a toda interação de água um equivalente sem WebGL, com movimento reduzido e no toque.
- **Do** ancore bordas na margem (clamp(1rem, 1.6vw, 1.5rem)) e deixe o layout funcionar com um único projeto.

### Don't:
- **Don't** use cards, painéis, sombras ou fundos translúcidos para agrupar conteúdo. A página não tem camadas levantadas.
- **Don't** leve cor saturada para a interface da Superfície fora dos prints. O verde-mar só aparece junto com a água.
- **Don't** use Anybody fora dos títulos de página nem ponha rótulos em caixa alta.
- **Don't** faça um movimento que pule, quique ou apareça de repente. A água entra por recorte, sobe ou desliza.
- **Don't** faça o conteúdo depender do WebGL, nem faça o visitante esperar a água carregar para ver a página.
- **Don't** repita o nome em tamanho grande e pequeno na mesma tela.
