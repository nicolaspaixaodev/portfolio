# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + Three.js + GSAP, publicado na Vercel (o desenvolvedor já tem conta).
Escolhido pelo desenvolvedor em 12/09/2026: é a mesma base da referência
(segerman.dev), gera páginas estáticas rápidas e aceita JavaScript puro, que é
o que ele domina.

## Users

**Primário:** cliente de freela. É um pequeno negócio ou uma pessoa que precisa
de um site e chega pelo perfil ou por uma proposta no Workana (Brasil e América
Latina), no Upwork (mundo) ou por indicação.

**Situação:** está avaliando se contrata um desenvolvedor jovem, sem histórico
de clientes pagos. Abre o link do portfólio que veio na proposta, geralmente
comparando com outros candidatos.

**Trabalho a fazer:** decidir se esse desenvolvedor consegue entregar um site
que impressiona e funciona, e então chamar no WhatsApp ou por e-mail.

## Product Purpose

Portfólio pessoal de Nicolas Paixão que vende projetos de site sob freela.
Sucesso é o cliente entrar em contato.

O próprio site é a prova principal. Para quem nunca contratou o Nicolas, a
experiência de navegar no portfólio é a amostra do que ele entrega.

## Positioning

Creative developer: sites com movimento, 3D e interação. Como não há clientes
pagos para mostrar, a afirmação precisa ser provada pela experiência do
próprio site, e não declarada em texto.

## Operating Context

- O cliente chega por um link externo: proposta do Workana/Upwork, perfil ou
  indicação.
- Botão de idioma **PT / EN** na barra superior, com o site inteiro nas duas
  línguas.
- Contato por **e-mail** e **WhatsApp**.
- O conteúdo é mantido por conversa com o Claude. O desenvolvedor pede
  "adicione esse projeto", "tire esse projeto" ou "coloque essa foto no Sobre",
  e a mudança acontece sem mexer no layout.

## Capabilities and Constraints

- **Referência obrigatória:** a estrutura e as técnicas de segerman.dev. São
  duas camadas: uma superfície editorial clara e um mundo WebGL escuro por
  baixo, trocadas por um controle no topo com transição de líquido. O índice de
  projetos mostra miniatura no hover, as páginas de projeto usam carrossel
  curvo de prints e rodapé com ano, função, link e próximo projeto, e existe
  uma página Sobre.
- **Não copiar a identidade da referência:** nada do planeta, das fontes
  (Newake, Aktiv Grotesk), da frase "beneath the surface" ou do mundo visual
  dele. Decidido pelo desenvolvedor em 12/09/2026.
- **Conteúdo separado do layout:** cada projeto é uma entrada independente.
  Adicionar ou remover um projeto, ou uma foto, não pode exigir mudança de
  componente.
- **Começa com 1 projeto** (Loja, cardápio digital). Mais projetos entram
  depois, por pedido do desenvolvedor, então o índice precisa funcionar bem com
  1 item e crescer sem mudança de layout. Nome, descrição, stack e texto de cada
  projeto são escritos pelo Claude a partir da análise do site e do código.
- **Sem fotos pessoais no lançamento.** Elas entram aos poucos, então todo
  espaço de foto precisa funcionar vazio.
- **Nome de exibição:** Nicolas Paixão.
- **Contato:** e-mail `paixaosantosnicolas@gmail.com` e WhatsApp
  +55 (79) 99867-7780 (`5579998677780`).
- **No ar:** https://nicolaspaixao.com.br (domínio comprado pelo Nicolas no Registro.br em 13/09/2026) e https://nicolas-paixao.vercel.app (projeto Vercel
  `nicolas-paixao`, time `tresor7`), desde 12/09/2026.
- **Em aberto:** o texto do Sobre (há um rascunho factual em
  `src/data/sobre.ts`, a ser reescrito com o desenvolvedor) e a linha de
  posicionamento abaixo do nome (rascunho em `src/i18n/ui.ts`).

## Evidence on Hand

- **Projeto no lançamento:** Loja, cardápio digital. No ar em
  https://loja-cardapio.vercel.app, com código em `D:\Projetos\loja-cardapio`.
  É um **projeto conceito**: o bistrô "Loja" é fictício, o número de WhatsApp é
  placeholder e as fotos vêm do Unsplash e de IA (ver `CREDITS.md` do projeto).
  Nunca apresentar como cliente real. O conteúdo fica em
  `src/content/projetos/loja-cardapio.md`.
- **Outros projetos** em `D:\Projetos` (Calculadora Científica, Calculadora
  Estatística, Sonora, LeetCode, Meu Bolso, Ofício) e
  `D:\Freelance\job-01-cafe` **não** entram por enquanto.
- **Clientes pagos:** nenhum até 12/09/2026. Não inventar clientes,
  depoimentos, métricas, prêmios ou "empresas atendidas". Projetos próprios ou
  de estudo não podem ser apresentados como trabalho de cliente.
- **Fotos pessoais:** nenhuma no lançamento.
- **Trajetória (para o Sobre, sujeita a aprovação do texto):** 18 anos, de
  Aracaju/SE. Conclui o técnico integrado em Edificações no IFS no fim de 2026 e
  vai cursar Ciência da Computação.

## Product Principles

1. **O site é a primeira entrega.** O cliente julga o que o Nicolas faria pelo
   que o portfólio faz. O craft é demonstrado, não declarado.
2. **Honestidade é argumento de venda.** Sem clientes inventados. A confiança
   vem da qualidade visível e de um contato fácil.
3. **Velocidade faz parte do craft.** O mundo 3D não pode segurar o cliente
   numa tela de carregamento. A camada clara aparece primeiro, e o 3D carrega
   por trás.
4. **Mesma pegada, identidade própria.** A estrutura vem da referência. O
   conceito, as fontes e o mundo visual são do Nicolas.
5. **Mudar conteúdo é conversa, não refatoração.** Projetos e fotos entram e
   saem sem tocar no layout.
