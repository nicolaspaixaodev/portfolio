# Portfólio · Nicolas Paixão

Site de creative developer. No ar em https://nicolaspaixao.com.br (também em https://nicolas-paixao.vercel.app).

Astro 7, GSAP, Lenis e Three.js, com CSS e JavaScript próprios e fontes do Fontsource (Anybody e Atkinson Hyperlegible Next). A água é uma simulação de fluido em WebGL, e o modo Abismo usa modelos 3D.

## Rodar

```bash
npm install
npm run dev
```

O comando `npm run build` gera o site estático em `dist/`.

## Publicar

```bash
npx vercel deploy --prod
```

A pasta já está ligada ao projeto `nicolas-paixao` na Vercel.

## Onde mexer no conteúdo

| O quê | Onde |
| --- | --- |
| Projetos | `src/content/projetos/*.md` (um arquivo por projeto) |
| Serviços do tambor da home (nome e texto) | `src/data/servicos.ts` |
| Prints dos projetos | `src/assets/projetos/<projeto>/` |
| Texto e foto do Sobre | `src/data/sobre.ts` |
| E-mail e WhatsApp | `src/data/site.ts` |
| Textos da interface (PT e EN) | `src/i18n/ui.ts` |

### Adicionar um projeto

1. Crie `src/content/projetos/<id>.md` copiando o formato de `loja-cardapio.md`.
2. Em `categoria`, diga em qual face do tambor ele entra: `criativo`, `ecommerce`, `saas` ou `landing`.
3. Coloque os prints em `src/assets/projetos/<id>/`. A capa vai pro tambor da home, e a galeria inteira vai pro carrossel da página do projeto.
4. Use `ordem` para definir a posição dentro do serviço.

As rotas `/projetos/<id>/` e `/en/projects/<id>/` são geradas sozinhas. Cada projeto novo ocupa o lugar de uma prévia ("Projeto prévia N") no serviço dele. Cada tambor tem pelo menos 3 linhas, e ganha mais quando um serviço passa de 3 projetos.

## Tambor de serviços

A home tem um tambor com 4 faces por linha, uma por serviço: Creative & Immersive, E-commerce, SaaS e Landing Pages. Ele gira pelas setas do painel "Serviços", pela lista, pelas setas do teclado, pelo arrasto pro lado no toque ou pelo clique na fresta de uma face vizinha. A home abre no primeiro serviço que tem projeto, e volta no último escolhido. A geometria fica em `src/scripts/tambor.ts`, e o CSS (sem WebGL) e a água usam as mesmas contas.

### Tirar um projeto

Apague o arquivo `.md` e a pasta de prints dele.

## Profundidade

O controle Superfície / Raso / Fundo, mais a lanterna do Abismo, troca o tema da página inteira. A rolagem do mouse também mergulha quando a página chega ao fim. Um link com `?profundidade=abismo` abre direto nessa profundidade. Sem WebGL, ou com movimento reduzido ligado, a troca é imediata e o texto fica visível.

### Modelos 3D

Os peixes do Abismo ficam em `public/modelos/` e **não** estão no repositório, porque a licença dos modelos do Fab ainda precisa ser confirmada. Para rodar o Abismo completo, coloque `atum.glb` e `tubarao.glb` nessa pasta. Sem eles, o site funciona e o Abismo aparece sem peixes.

## Contexto de design

- `PRODUCT.md`: público, posicionamento e regras.
- `.impeccable/surfaces/src-pages-index-astro.md`: contrato da direção visual Mar raso ao meio-dia.
