# Portfólio · Nicolas Paixão

Site de creative developer. No ar em https://nicolaspaixao.com.br (também em https://nicolas-paixao.vercel.app)

Astro 7, com CSS e JavaScript próprios e fontes do Fontsource (Anybody e Atkinson Hyperlegible Next). O mundo 3D da camada de baixo entra na fase 04 do roadmap.

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

As rotas `/projetos/<id>/` e `/en/projects/<id>/` são geradas sozinhas. A coluna da home passa a mostrar só as capas quando houver 3 projetos ou mais.

### Tirar um projeto

Apague o arquivo `.md` e a pasta de prints dele.

## Profundidade

O controle Superfície / Raso / Fundo troca o tema da página inteira. Um link com `?profundidade=raso` abre direto nessa profundidade. Sem suporte a View Transitions, ou com movimento reduzido ligado, a troca é imediata.

## Contexto de design

- `PRODUCT.md`: público, posicionamento e regras.
- `.impeccable/surfaces/src-pages-index-astro.md`: contrato da direção visual Mar raso ao meio-dia.
