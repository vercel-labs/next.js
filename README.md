# Repro: next.js#89828 — broken CSS `url()` when a Turbopack rule sets `type: 'asset'`

Next.js 16.3.1-canary.26 (Turbopack).

## Run

```
npm install
npm run dev   # http://localhost:3000
```

## Expected

`app/style.css` is emitted with the rewritten asset URL:

```css
.bg { background: url("../media/img.<hash>.svg"); }
```

## Actual (with `turbopack.rules['*.svg'].type = 'asset'` in next.config.ts)

```css
.bg { background: url("./img.svg"); }
```

which 404s (requested as `/_next/static/chunks/img.svg`). Removing the rule from
`next.config.ts` restores the correct rewrite. `next build` is affected too
(`.bg{background:url(./img.svg)}`). A JS `import svgUrl from './img.svg'` with the
rule active resolves correctly to `/_next/static/media/img.<hash>.svg`, so only
CSS `url()` references are broken.
