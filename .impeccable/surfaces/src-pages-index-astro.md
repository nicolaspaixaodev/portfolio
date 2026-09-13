---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/projetos/[slug].astro","src/pages/sobre.astro"]
---

# Home e mundo do portfólio

**Escopo:** home (`src/pages/index.astro`) e o mundo visual compartilhado por página de projeto e Sobre.
**Modo:** Experience. O trabalho conduz desde o primeiro viewport, e a interface recua.

## Surface

- **Público e trabalho:** o cliente de freela abre o link da proposta, geralmente no celular e na rua, e decide se esse dev entrega um site que ele quer ter.
- **Ação:** falar no WhatsApp (principal) ou copiar o e-mail.
- **Prova:** o projeto Loja Cozinha Autoral, com link pra testar o fluxo inteiro. O próprio site é a segunda prova.
- **Restrições:**
  - Estrutura de segerman.dev sem a identidade dele.
  - 1 projeto no lançamento.
  - Nenhuma foto pessoal.
  - PT/EN.
  - Nada inventado (clientes, números, disponibilidade).
- **Momento memorável:** o mergulho.

## Direction contract

THESIS: O site é o mar raso da Orla de Atalaia ao meio-dia. Em cima fica uma página editorial ao sol. Mergulhar afunda tudo em água verde-mar, onde a luz desenha cáusticas sobre o trabalho. Recusa o portfólio creative-dev padrão (fundo escuro, blob 3D, neon) e o planeta do Segerman.

OWN-WORLD: Na superfície, sol #F6F8F7 e tinta #0B1F24. Embaixo, verde-mar #1FA396, fundo #0D5E6B, brilho #EFFFF8 e areia molhada #C9B48A. Sol a pino #FFD23F aparece só na linha d'água e na ação principal. Na superfície, os prints ficam desbotados pelo sol (preto e branco com granulado) e a cor aparece onde o mouse mexe na água. Embaixo d'água, a cor aparece inteira. Cor saturada vive apenas dentro dos prints. (Ajustado a pedido do Nicolas em 12/09/2026, a partir do efeito de revelação da referência.) Display: Anybody larga e pesada, em caixa alta. Texto: Atkinson Hyperlegible Next, pra ser legível no sol do celular. Sem cards e sem sombras: prints soltos, fios finos de tinta, e a linha d'água como único grafismo recorrente.

STORY: O visitante vê um site vivo e caprichado. Em segundos entende quem é Nicolas, creative developer em Aracaju, e o que ele fez. Mergulha por curiosidade, testa o Loja, pensa "quero um desses" e chama no WhatsApp.

FIRST VIEWPORT: No desktop, NICOLAS PAIXÃO em Anybody expandida ocupa uns 45% da largura à esquerda, com uma linha de posicionamento embaixo, e as letras afinam perto do mouse. À direita, uma coluna com uma capa por projeto, em preto e branco com granulado, que ganha cor sob o mouse. Os outros prints ficam no carrossel da página do projeto. No topo ficam o nome pequeno, PT/EN, Sobre e o controle Superfície/Mergulhar com a linha d'água amarela. O índice de projetos fica à direita. No rodapé, o e-mail (clique copia) e o WhatsApp como ação amarela. No celular, o nome em duas linhas, o print embaixo e o WhatsApp fixo. Assinatura: ao mergulhar, a linha d'água sobe e a água cobre a página (onda 2D real na GPU). Ponteiro e dedo ondulam a superfície, cáusticas deslizam sobre prints e texto, e na página de projeto os prints se curvam em arco sob a água. Movimento como água rasa: lento, ondulado, refratado, sem pulo nem quique.

FORM: Mar raso ao meio-dia, posição 7 da lista ordenada (luz atravessando o mar raso), seed 60d9d26b. Elevações: fluido com física real (bacia de tinta); cor presa nos prints (léxico); profundidades nomeadas e linkáveis Superfície/Raso/Fundo com equivalente em texto (ciclorama); linha d'água sempre indica onde você está (sequenciador); grade e índice reconhecíveis sob a refração (cidade que dobra).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Exceções pedidas pelo Nicolas

- **Carrossel da página do projeto em cor cheia na superfície.** Ele mandou o print da página PayJustNow do segerman.dev, com os prints coloridos, e pediu: "perceba que tem carrosel, é ai que voce coloca todos os print [...] copia o que ele fez". O preto e branco com granulado vale para as capas (home, próximo projeto); o carrossel mostra o trabalho em cor.
- **Topo da home com "Creative developer em Aracaju" no lugar do nome pequeno.** Na referência, o nome é pequeno e o título gigante é a função. Aqui o título gigante é o nome, então o topo leva a função, pra não repetir o nome duas vezes na mesma tela.
- **Capa da home em recorte 4:5 enquanto houver menos de 3 projetos**, pra primeira tela não ficar vazia ("vazio/minimalista demais" é anti-referência dele). A partir do 3º projeto, as capas voltam a 16:10.

## Decisões em aberto

- **Linha de posicionamento** abaixo do nome: rascunhar em PT/EN e aprovar com o Nicolas.
- **"Disponível":** a referência mostra uma data de disponibilidade. Só entra se o Nicolas informar uma.
- **Sem WebGL ou com movimento reduzido:** a superfície fica completa e o mergulho vira troca de cor com transição simples.
- **Faces:** Anybody e Atkinson Hyperlegible Next são o ponto de partida. Confirmar com `/impeccable typeset` no build.
