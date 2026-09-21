# Progresso

Diário de obra do portfólio. Serve para retomar o trabalho se a sessão cair ou o limite de uso acabar. Diga "continua a fase 4" e comece por aqui.

- **No ar:** https://nicolaspaixao.com.br (depois que o DNS propagar) e https://nicolas-paixao.vercel.app
- **Domínio:** `nicolaspaixao.com.br` e `www.` foram adicionados ao projeto Vercel em 13/09/2026. Em 13/09/2026 o Nicolas trocou os servidores DNS no Registro.br para `ns1.vercel-dns.com` e `ns2.vercel-dns.com`. A delegação propagou no mesmo dia: os nameservers aparecem com ✓ e o site responde 200 em https://nicolaspaixao.com.br. O `www` redireciona com 308 para o domínio principal, mantendo o caminho. Esse redirecionamento está na configuração do domínio na Vercel (`npx vercel api /v9/projects/nicolas-paixao/domains/www.nicolaspaixao.com.br`), e não num `vercel.json`, porque a regra `has: host` no `vercel.json` não teve efeito neste projeto.
- **Roadmap:** https://claude.ai/code/artifact/2de38f5b-2cd1-467e-8b95-f442e204f10c
- **Contrato de design:** `.impeccable/surfaces/src-pages-index-astro.md`

## Fases 00 a 03: feitas (12/09/2026)

Fundação, direção "Mar raso ao meio-dia", estrutura em Astro e movimento (Lenis, GSAP, SplitText, ClientRouter). Os detalhes estão no roadmap.

## Fase 04: a camada de baixo (WebGL). Feita e no ar em 12/09/2026

### Arquitetura decidida

- **Canvas:** um só, fixo, persistente entre páginas (`transition:persist`). Ele fica atrás do texto (`main` com z-index acima dele) e acima do fundo da página.
- **Texto e layout** continuam em HTML. **Só as imagens** viram planos Three.js posicionados pelo retângulo do DOM a cada quadro. As `<img>` do DOM ficam invisíveis quando o plano está pronto, mas continuam lá para layout, hover e acessibilidade.
- **Fluido** (stable fluids: advecção, divergência, pressão, curl) em render targets de meia precisão. O ponteiro injeta velocidade e tinta. A tinta é a máscara que revela a cor nos planos da superfície.
- **Na navegação entre páginas** o GL se desliga (`agua-ativa` sai), o DOM volta a aparecer para a capa voar via View Transitions, e na página nova os planos são recriados.
- **Carrega por último** (import dinâmico), só com WebGL2 e sem "reduzir movimento". Sem isso, fica o site da fase 03.

### Etapas

| # | Etapa | Estado |
|---|---|---|
| 4.1 | Infra: canvas persistente, renderer, câmera em pixels, planos que seguem o DOM | **feito**, em `src/scripts/agua/index.ts` |
| 4.2 | Fluido do mouse revelando a cor nos planos da superfície (B&W + granulado no shader) | **feito** e testado na home, em `fluido.ts` e `shaders.ts` |
| 4.3 | Planos esticando com a velocidade da rolagem (home) e do carrossel | **feito** e testado no carrossel |
| 4.4 | Fundo d'água com cáusticas em Raso e Fundo, e cáusticas sobre os prints | **feito** e testado |
| 4.5 | Carrossel curvo embaixo d'água | **feito** e testado |
| 4.6 | Celular, desempenho, fallback, revisão e deploy | **feito**: celular com toque, movimento reduzido sem água, detector limpo, produção verificada |

### Notas técnicas

- **Texturas:** são carregadas como `ImageBitmap` com `imageOrientation: "flipY"` e `texture.flipY = false`, usando a maior versão do srcset que cobre o plano. Usar a `<img>` do DOM direto dava `GL_INVALID_VALUE` e o plano ficava preto.
- **Chunk do Three.js:** `agua.*.js`, uns 540 KB minificado. Só carrega em `requestIdleCallback`, depois da página.
- **Detector de navegação:** em `astro:before-preparation` a água desmonta, e em `astro:page-load` monta de novo.
- **Ordem de desenho:** os planos precisam de `transparent: true` para entrar na mesma fila do fundo d'água (renderOrder -1). Sem isso, o fundo cobre os prints no Raso e no Fundo.
- **Acentos:** a máscara do SplitText (`.letra-mask`) leva `padding-top: .2em; margin-top: -.2em` para o til do Ã não ser cortado.
- **Verificação:** o script `fase4.mjs` (puppeteer-core + Edge headless com SwiftShader) está na scratchpad da sessão de 12/09. Os prints ficam em `.impeccable/review/fase4/`.
- **Transição entre páginas:** a água só remonta depois de `document.activeViewTransition.finished`, ou 1150 ms depois sem essa API. Antes disso, os planos da página nova apareciam no destino enquanto a capa ainda voava, e a imagem duplicava.
- **O painel do navegador do app aborta qualquer View Transition** ("invalid state"), provavelmente por estar oculto. Teste transições no Edge headless (`vt.mjs`, `fase4b.mjs`), não no painel.
- **O `<html>` recebe `view-transition-name: astro-…`** por causa do `transition:animate="none"`. Então a troca de profundidade usa esse nome, e não `root`, mas funcionou nos testes.

### Ajuste pedido depois da fase 04 (12/09/2026)

O Nicolas comparou com o segerman.dev: o rastro do mouse precisa abrir a página **inteira**, e não só as fotos, e o granulado precisa ser forte.

- **O fundo d'água** (`FRAGMENTO_FUNDO`) agora aparece onde há tinta do fluido, mesmo na Superfície, com uma espuma clara no contorno.
- **As fotos na superfície** ficam em duas cores, da tinta ao sol, com granulado forte (`grao * 0.34`), e a máscara tem borda nítida (`smoothstep(0.1, 0.16)`).
- **O fluido:** raio 0.0032, tinta proporcional à velocidade do mouse (máximo 0.55), dissipação medida em tempo real (tinta 1.7, velocidade 0.45). O rasgo fecha em uns 2 segundos em qualquer máquina.

### Segundo ajuste (12/09/2026, a partir de um vídeo do segerman.dev)

O Nicolas achou o rastro e o granulado fortes demais. No vídeo da referência, o rastro é uma pincelada fina (uns 100 px), de cor chapada, que some em menos de 1 s, e o granulado é fino.

- **Um respingo por quadro:** o movimento do mouse é acumulado e aplicado em `respingarPendente()`. Mouse de 1000 Hz gerava dezenas de respingos por quadro.
- **Fluido:** raio 0.0013, tinta até 0.32 (`0.05 + rapidez * 6`), dissipação da tinta 3.2, da velocidade 0.9, vorticidade 9.
- **Shader:** máscara `smoothstep(0.06, 0.11)`, granulado 0.13, espuma quase invisível, cáusticas dentro do rasgo a 35%.
- **Granulado CSS** (sem WebGL): opacidade 0.2.

### Terceiro pedido (12/09/2026): feito e no ar

**A. Efeito no nome.** Dentro da pincelada do mouse, o título aparece claro, com franja colorida, como o "CREATIVE DEVELOPER" do Segerman.
- Plano: o título vira textura (canvas 2D desenhando cada `.letra` na posição do DOM, com a Anybody em `fontStretch: extra-expanded`).
- Um plano GL desenha o título em tinta fora da pincelada e em brilho, com separação de cor, dentro dela.
- O título do DOM fica com `color: transparent` depois da entrada (classe `gl-titulo`) e volta na troca de página.

**B. Descer com a rolagem.** A profundidade vira um número contínuo de 0 a 2 (`estado.profundidade`), guiado pela roda do mouse ou pelo toque (`lenis` virtual-scroll) quando a página não tem mais pra onde rolar.
- 0 a 1: a linha d'água sobe da base da tela, com ondas e a linha amarela.
- 1 a 2: a cor escurece aos poucos do verde-mar ao fundo, com feixes de luz e partículas que sobem.
- Parado por 600 ms, a água assenta no nível mais próximo.
- `data-depth` muda por limiar: menor que 1 é superfície, de 1 a 1,5 é raso, e a partir de 1,5 é fundo.
- Os botões animam o número. Sem WebGL, fica a transição da fase 03, que avança um nível por gesto.

**Como ficou:**
- **Nome:** `Titulo` em `agua/index.ts` e `FRAGMENTO_TITULO`. A textura é refeita quando o tamanho do título muda. O efeito de proximidade das letras desliga quando o título está em GL (classe `gl-titulo`). Se o navegador não tem `ctx.fontStretch`, o nome fica no DOM.
- **Descida:** `src/scripts/profundidade.ts`. São 900 px de rolagem por nível, e a água assenta na direção do gesto quando ele passa de 20% de nível. Os shaders usam `linhaAgua()` e `submerso()` em `shaders.ts`, com partículas e a luz logo abaixo da superfície.
- **Testes:** `descer.mjs` e `nome.mjs` na scratchpad. Os prints ficam em `.impeccable/review/fase4/20-23` e `30-32`.

## Pedido depois da revisão (13/09/2026): feito e no ar

O Nicolas mandou prints do segerman.dev no modo escuro e da nossa home. Pediu:
1. **Modo escuro** como o da referência, no nosso mundo: mar muito profundo, com peixes 3D (tubarões aparecendo e sumindo, peixe-lanterna com a luz). Decisão: vira o 4º nível de profundidade, **Abismo**, alcançado pela rolagem e por um botão de alternar no topo (como a lua do Segerman). O download de modelos 3D precisa de autorização dele.
2. **Carrossel da página do projeto** como o da referência no escuro: arco côncavo forte (as bordas vêm pra frente, como se o visitante estivesse dentro de um cilindro). Plano na superfície.
3. **Home:** a capa em pé 4:5 ficou "gigante e feia". Voltar ao tamanho da referência (16:10, uns 32vw), granulado mais visível e **carrossel vertical infinito** na coluna com os prints do projeto. A rolagem em cima da coluna gira o carrossel; fora dela, desce na água.

Isso substitui a capa em pé feita na 3ª rodada da revisão, por pedido explícito do Nicolas.

**Como ficou:**
- **Abismo:** 4º nível (profundidade 0 a 3), alcançado pela rolagem ou pelo botão de lanterna (ícone `lanterna`). No abismo, o mesmo botão volta pra superfície. Tema `data-depth="abismo"`, fundo #04151B.
- **Peixes:** desenhados em código em `src/scripts/agua/abismo.ts`. São 2 tubarões que cruzam a névoa em intervalos aleatórios e 1 peixe-lanterna que segue o mouse devagar, com a isca brilhando e uma PointLight (decay 0). Os corpos ondulam no shader com `customProgramCacheKey` por comprimento.
- **Modelos:** se existirem `public/modelos/tubarao.glb` ou `public/modelos/peixe-lanterna.glb`, eles substituem os desenhados. Os HEAD 404 no console são normais sem os arquivos.
- **Fab:** o Nicolas ofereceu acesso à conta Epic/Fab. Criar login ou usar senha é proibido pra mim, então ele mesmo baixa o modelo grátis (GLB) e coloca na pasta.
- **Luz:** o canvas sai em cor linear, então a luz ambiente fica em 7, a direcional em 6 e a lanterna em 40.
- **Carrossel côncavo:** `mundo.z += uCurva * x² * vw * 0.24`, com curva de `profundidade * 0.55` limitada a 1.
- **Home:** carrossel vertical infinito (3 cópias, lerp 0.085, a roda do mouse em cima da coluna não desce na água), 16:10 com 28.5vw, granulado a 0.2 no GL e 0.3 no CSS. As texturas são compartilhadas por URL.
- **Limpeza:** saíram a sombra dura do traço do controle e o pulo do botão (agora ele só clareia no hover).

## Modelos 3D do Fab (13/09/2026): feito e no ar

O Nicolas baixou do Fab (pasta `C:\ProgramData\Epic\EpicGamesLauncher\VaultCache\FabLibrary\`):
- **Shark** (Optic Idealist): `shark.glb` com 7,4 MB, textura 4K, animação "Action_Shark Armature" de 5 s.
- **Tuna Fish** (GoldenZtuff): `tuna_fish.glb` com 59 MB, 6 texturas 4K, animação "Swim" de 2 s.

A licença não pôde ser conferida (a página do Fab responde 403 sem login). Os créditos vão no Sobre, e o Nicolas confirma a licença.

**Decisão:** o atum segue o mouse e os tubarões cruzam ao fundo. O peixe-lanterna desenhado sai, e fica só a luz dele seguindo o cursor.

**Perseguição natural:**
- O peixe sempre anda na direção do nariz, sem ré.
- Yaw e pitch com velocidade de giro limitada. Pra mudar de lado, ele faz a curva em U pela profundidade.
- Velocidade depende da distância. O nariz, não o centro, mira o mouse.
- Velocidade da animação acompanha a velocidade.

**Otimização:** gltf-transform com meshopt, texturas webp em 1024 px. Os modelos só carregam quando o Abismo é ativado.

**Como ficou:**
- **Arquivos:** `public/modelos/tubarao.glb` (272 KB) e `public/modelos/atum.glb` (633 KB).
- **Orientação** (descoberta pelos olhos e pelos lobos da cauda):
  - Tubarão: nariz em −X e dorso em +Z. Correção `rotation.set(-π/2, π, 0, "YXZ")`.
  - Atum: nariz em +Z e dorso em +Y. Correção `rotation.y = π/2`.
  - `montarSuporte()` centraliza e escala o modelo pelo comprimento.
- **Perseguição:** `nadarAtum()` em `src/scripts/agua/abismo.ts`.
  - Yaw entre 0 e π, passando por π/2 na frente da câmera, com giro limitado e histerese de 80 px.
  - Pitch limitado a ±0,95 rad e velocidade de 60 a 480 px/s conforme a distância do nariz ao alvo.
  - Rolagem proporcional à velocidade do giro. A animação acelera junto (0,8 a 2,8x).
- **Cor:** o renderer passou para `SRGBColorSpace`. Os shaders próprios não sofrem conversão; os materiais prontos saem certos.
- **Créditos:** no rodapé do Sobre, em PT e EN. A licença no Fab ainda precisa ser confirmada pelo Nicolas.
- **O peixe-lanterna desenhado saiu.** Ficou a luz fria que segue o cursor.

**Ajuste pedido (13/09/2026):**
- **O atum não deve ser realista.** `estilizarAtum()` troca o material por um verde-mar (#3B8A8D). A textura só insinua o desenho da pele (luminância entre 0,62 e 1,12), com contorno de luz fria e olho escuro. A córnea foi escondida e o comprimento caiu pra 170.
- **O tubarão nadava de lado.** A orientação estava errada: o dorso é +Y, não +Z. A correção certa é só `rotation.y = π`, conferida de perto (peitoral embaixo, dorsal em cima, cauda vertical). A cor foi puxada pra #8FB3B1.

## Pedido (13/09/2026, madrugada): feito e no ar

1. **Tubarões:** a batida da cauda não bate com a velocidade. Plano: medir as batidas por ciclo do clipe e amarrar `timeScale` à velocidade (cerca de 0,7 comprimento de corpo por batida).
2. **Carrosséis como os do Segerman, sem repetição** (o Nicolas pediu os dois):
   - **Home:** a coluna volta a rolar com a página (sem clones). A roda desce na água quando chega ao fim.
   - **Projeto:** a roda em qualquer lugar move o carrossel horizontal (`estado.consumirRolagem`). No fim, desce na água.
3. **Modo escuro (Fundo e Abismo), como no Segerman:** a pincelada mostra a superfície por baixo (fundo sol, texto em tinta, fotos em preto e branco). Os textos do DOM ficam com `-webkit-text-fill-color: transparent` e são redesenhados numa camada GL (canvas 2D por palavra, canal R normal e G rótulo), trocando de cor dentro da pincelada.

## Fase 05: acabamento (em andamento, 12/09/2026)

| # | Etapa | Estado |
|---|---|---|
| 5.1 | Auditoria com Lighthouse (desktop e celular) no site publicado | **feito**: desktop 99/100/100/100; celular 75/100/100/100 antes das correções (TBT 880 ms) |
| 5.2 | Correções: acessibilidade, desempenho, SEO (sitemap, robots, JSON-LD, OG) | **feito**: no celular a água acorda no 1º toque (ou em 6 s); o fluido para 3,5 s depois do último movimento; `og-pt.jpg`/`og-en.jpg`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml` com hreflang, JSON-LD Person; controle de profundidade some sem JS |
| 5.3 | Revisão dos textos PT/EN | **feito**, sem mudança necessária; a linha embaixo do nome e o Sobre continuam pendentes de aprovação |
| 5.4 | Revisão independente (`impeccable-finish-reviewer`) e correções | **feito: disposição `ship`** (13/09/2026) depois de 4 rodadas. A última corrigiu a linha d'água, que riscava o rodapé: agora fica abaixo dele, e os rodapés subiram para 2rem. As 10 imagens publicadas têm a origem embutida (`embed-prompt --scan`: 0 faltando) |
| 5.5 | `DESIGN.md` pelo `impeccable-documenter` | feito uma vez (antes do Abismo). **Regenerar** depois da revisão das mudanças novas |
| 5.6 | Deploy, roadmap R05, memória | **roadmap R05 publicado** (13/09/2026) |
| 5.7 | Casos de borda com as novidades | **feito**: movimento reduzido, sem WebGL, celular no Abismo, EN, 404. Bug corrigido: depois da navegação, `profundidade.ts` lia `data-depth` já resetado pelo roteador; agora lê o localStorage |
| 5.8 | Git e GitHub | **feito**: https://github.com/nicolaspaixaodev/portfolio (público, branch `main`). Autor Nicolas e **sem** Co-Authored-By (pedido dele, na memória). `.impeccable/review/` e `public/modelos/*.glb` ficam fora do Git (peso e licença); o README explica como repor os modelos. Deploy continua pela CLI (`npx vercel deploy --prod`), sem integração Git na Vercel |
| 5.9 | Revisão independente das mudanças novas (Abismo, textos, carrosséis) | **disposição `fix`** (13/09/2026), 6 correções, todas aplicadas (ver "Tambor de serviços e correções da 5.9") |
| 5.10 | Tambor de serviços na home (pedido do Nicolas com rascunho) | **feito e no ar** (13/09/2026). Revisão: disposição `ship` depois de 4 rodadas. O Nicolas pediu, no meio, "separar e arredondar um pouco as bordas" |
| 5.11 | `DESIGN.md` regerado (tambor e 4 profundidades) | ver commit |

**Lighthouse depois das correções (no ar):** celular 98/100/100/100 (TBT 10 ms, LCP 2,1 s).

**Domínios consultados na Vercel (12/09/2026), sem compra:** nicolaspaixao.dev US$ 9,99/ano, nicolaspaixao.com US$ 11,25, nicolaspaixao.me US$ 13,99, nicolaspaixao.studio US$ 21,99. paixao.dev está indisponível. A compra é decisão e ação do Nicolas, que tende a escolher **nicolaspaixao.com** (fica pra depois). Em 12/09/2026 ele já está mandando o link da Vercel pros amigos pedindo opinião. Depois de comprar, trocar `site` no `astro.config.mjs`, o link da OG, o `robots.txt` e o texto do topo da OG.

**Correções da 1ª revisão (13/09/2026):**
1. Capa da home em 4:5 no desktop com menos de 3 projetos, recorte à direita. O GL respeita object-position e escolhe a fonte maior.
2. Carrossel em cor na superfície: mantido como exceção registrada no contrato.
3. No celular com água, a capa fica em preto e branco até o toque. O fade automático fica só com `sem-agua`.
4. `svg.linha-mar` amarela ondulando no pé da tela (no celular, só no fim da página).
5. Botão fixo do WhatsApp sem sombra, com borda de tinta.
6. `--fg-2` no Raso passa a ser a tinta cheia.
7. Topo da home com a função: exceção registrada no contrato.

**2ª revisão (verdict):** itens 1, 4 e 6 ficaram parciais, e o recorte 4:5 cortava palavras. O Nicolas escolheu fazer mais uma rodada.

**3ª rodada (13/09/2026, no ar):**
- Campo opcional `capaVertical` (no Loja, `celular-inicio.png`) como capa em pé na home desktop com menos de 3 projetos.
- `linha-mar` com traço de 5 px, mais ondulação, atrás do conteúdo e visível no celular.
- Rótulos com peso 600 no Raso e cáusticas do fundo mais suaves.
- Veredito pedido ao revisor.

Lista original da fase:
- Auditoria de acessibilidade, performance e celular.
- Casos de borda.
- Imagem de compartilhamento (OG) e SEO.
- Domínio próprio.
- Revisão pelo `impeccable-finish-reviewer`.
- `DESIGN.md` escrito pelo `impeccable-documenter`.

Pendências do Nicolas:
- Aprovar a linha embaixo do nome.
- Reescrever o Sobre junto comigo.
- Escolher o domínio.

## Tambor de serviços e correções da 5.9 (13/09/2026)

**Pedido do Nicolas:** uma seção que seja a porta de entrada dos serviços, com 4 abas fixas (Creative & Immersive, E-commerce, SaaS, Landing Pages). O giro precisa ser natural e fluido, pelas setas, conforme o rascunho no tablet: colunas de 3 cards com faces inclinadas dos lados. Na home, só a capa de cada projeto, e prévias ("Projeto prévia 1, 2...") onde falta projeto.

**Decisões tomadas por mim (avisadas ao Nicolas):**
- A Loja Cozinha Autoral fica em **E-commerce**, porque tem carrinho, adicionais, cupom e fechamento do pedido.
- O tambor substitui a coluna de capas e o índice de projetos da home.
- A home abre no primeiro serviço que tem projeto (E-commerce) e lembra o último escolhido (`sessionStorage`).
- As prévias são imagens escuras com "Projeto prévia N / Em breve", uma por língua, em `src/assets/previas/`, com origem embutida.

**Como funciona:**
- `src/data/servicos.ts`: nome e texto de cada serviço. O campo `categoria` do projeto diz a face.
- `src/scripts/tambor.ts`: a geometria. Em repouso, a face da frente fica chapada e as vizinhas ficam a 68°. Girando, a face dobra pela quina.
  - **Perspectiva própria por linha** (foco = 2,2 larguras): com a câmera única no centro da tela, a fresta da direita ficava escondida atrás da face da frente.
  - No WebGL, os vértices da face andam no shader (`uFace`, `uPose`, `uFoco`) com o plano em z = 0.
  - No CSS, `perspective` e `transform` da face usam as mesmas contas.
- `Inicio.astro`:
  - Cada linha é um tween GSAP (`power3.inOut`, 1,2 s, cascata de 85 ms por linha).
  - Controles: setas do painel, lista, teclado ←/→, arrasto no toque, trackpad lateral e clique na fresta.
  - Só a face da frente fica focável (`inert` nas outras) e leva o `view-transition-name`.
  - A legenda troca junto, e um `aria-live` anuncia o serviço.

**Correções da revisão 5.9:**
1. **Coluna cobrindo o cabeçalho:** os planos somem suaves logo abaixo dele (`uCorte`). As legendas somem ao encostar, e sem WebGL o cabeçalho ganha fundo.
2. **Atum:** a revisão pediu `renderOrder` 1,5, com o atum passando por cima dos prints. **Revertido a pedido do Nicolas (13/09/2026):** "não pode passar na frente das demonstrações, ele é uma coisa que fica no fundo". Agora o atum fica atrás dos prints e do texto, como os tubarões.
3. **Foto sob a pincelada no Fundo e no Abismo:** comprovada com `?tinta-parada`, um parâmetro de depuração que zera a dissipação da tinta.
4. **Contrato:** registra o Abismo, a pincelada que inverte, a roda no carrossel e o tambor. O FORM lista as 4 profundidades. **Falta** regerar o DESIGN.md.
5. **Rótulos na descida:** com `:root.descendo`, `--fg-2` vira tinta.
6. **Partículas:** viraram neve marinha, com flocos irregulares em 3 camadas, desfoque por distância e deriva. A lanterna do ponteiro (`uPonteiro`) acende os flocos por perto e deixa um halo fraco.

**Rodadas da revisão do tambor (13/09/2026):**
- **Retorno do Nicolas:** faces separadas por um vão de 6%, cantos de 10 px e curva vertical sutil (9%), na pegada da coluna do Segerman.
- **Revisão:**
  - Setas curvas de giro (ícones `giro-esquerda` e `giro-direita`).
  - Frestas só com o tom borrado da vizinha: mipmaps e bias no WebGL, desfoque recortado dentro da `.midia` no CSS.
  - Cantos das frestas redondos na tela: SDF achatado por |cos θ| e border-radius elíptico.
  - A face some antes de dobrar por trás da quina (opacidade de 1 a 0 entre a = 1,0 e 1,12).
  - Legendas sem sobreposição: a que sai some em 180 ms e a que entra começa em 280 ms.
  - Prévias sem "Em breve" (não prometer prazo).
  - Setas flutuantes no celular quando as capas estão na tela.
  - Rodapé do celular com espaço pro WhatsApp fixo.
  - Lanterna mais forte.
- **Depuração:**
  - `?giro-parado=0.4` trava o giro no meio.
  - `?tinta-parada` não dissipa a pincelada.


## Proposta de conteúdo (20/09/2026), aguardando aprovação

- **Pedido do Nicolas:** as coisas básicas de portfólio, como FAQ e detalhes, "para que a pessoa entre e saia sabendo de tudo que faço".
- **Ponto de retorno:** a tag `v1-antes-do-conteudo` foi publicada no GitHub. Pra voltar, use `git checkout v1-antes-do-conteudo`, ou promova o deploy anterior na Vercel.
- **Proposta:** https://claude.ai/artifact/9ud97SxTgyxrzFYiWbKkT8, com cópia em `docs/proposta-conteudo.html`. São 10 itens (A1 a A10):
  - página nova "Como funciona", com serviços em detalhe, processo, o que vem incluso, FAQ e contato;
  - link "Ver detalhes" no tambor;
  - case mais completo;
  - Sobre reescrito;
  - dados estruturados.
- **Perguntas que só ele responde:** preço, prazos, pagamento, pós-entrega, tempo de resposta, alcance, contrato, redes e foto.
- **Reaproveitamento:** a v2 (`D:\Projetos\portfolio-v2`, não publicada) já tem textos de FAQ, processo e serviços. Reaproveitar o texto revisado, não o visual. A frase da v2 "atendo clientes em Portugal" não é sustentável e fica de fora.
- **Execução:** num ramo separado, com prévia antes de ir pro ar.
