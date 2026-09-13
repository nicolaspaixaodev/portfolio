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
| Prints dos projetos | `src/assets/projetos/<projeto>/` |
| Texto e foto do Sobre | `src/data/sobre.ts` |
| E-mail e WhatsApp | `src/data/site.ts` |
| Textos da interface (PT e EN) | `src/i18n/ui.ts` |

### Adicionar um projeto

1. Crie `src/content/projetos/<id>.md` copiando o formato de `loja-cardapio.md`.
2. Coloque os prints em `src/assets/projetos/<id>/`.
3. Use `ordem` para definir a posição no índice.

As rotas `/projetos/<id>/` e `/en/projects/<id>/` são geradas sozinhas. A coluna da home passa a mostrar só as capas quando houver 4 projetos ou mais.

### Tirar um projeto

Apague o arquivo `.md` e a pasta de prints dele.

## Profundidade

O controle Superfície / Raso / Fundo, mais a lanterna do Abismo, troca o tema da página inteira. A rolagem do mouse também mergulha quando a página chega ao fim. Um link com `?profundidade=abismo` abre direto nessa profundidade. Sem WebGL, ou com movimento reduzido ligado, a troca é imediata e o texto fica visível.

### Modelos 3D

Os peixes do Abismo ficam em `public/modelos/` e **não** estão no repositório, porque a licença dos modelos do Fab ainda precisa ser confirmada. Para rodar o Abismo completo, coloque `atum.glb` e `tubarao.glb` nessa pasta. Sem eles, o site funciona e o Abismo aparece sem peixes.

## Contexto de design

- `PRODUCT.md`: público, posicionamento e regras.
- `.impeccable/surfaces/src-pages-index-astro.md`: contrato da direção visual Mar raso ao meio-dia.
