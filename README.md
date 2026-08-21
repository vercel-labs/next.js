# Reproduction for vercel/next.js#75137 — wrong CSS module ordering for a shared component

A shared `ComponentLayout` (red background, merges an incoming `className`) is used by:

- `HeaderCard` -> rendered inside the **root layout** through the client component `NavigationWrapper` (`'use client'`), overriding the background to **yellow**
- `page.tsx` directly (server), `ServerCard` (server), `ClientCard` (client), `DynamicCard` (`next/dynamic`)

## Run

```bash
npm install
npm run dev      # next dev --webpack
# open http://localhost:3000
```

Optional automated check (prints computed background colors):

```bash
npx playwright install chromium-headless-shell
npm run check
```

## Expected

The first box ("HeaderCard in root layout") is **yellow**, because `HeaderCard.module.css`
must come after `ComponentLayout.module.css`.

## Actual (`next dev` with webpack, Next >= 14.2 through 16.3.1-canary.25)

The first box is **red**. `/_next/static/css/app/page.css` re-emits
`.ComponentLayout_layout__*` *after* `/_next/static/css/app/layout.css` already emitted
`.ComponentLayout_layout__*` + `.HeaderCard_overrideHeader__*`, so the shared component's
own rule wins over the override.

```
layout.css: .ComponentLayout_layout__*  .HeaderCard_overrideHeader__*
page.css:   .ComponentLayout_layout__*  .ClientCard_card__*  .ServerCard_card__*
```

## Notes

- `next dev --webpack`: broken (14.2.35, 15.3.9, 16.3.1-canary.25)
- `next dev` with Turbopack: correct (yellow)
- `next build --webpack` + `next start`: correct (yellow); the duplicated rule is deduped in the merged production chunk
