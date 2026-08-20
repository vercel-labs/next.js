# next#73834 — `next build` fails when a CSS `url()` contains `!!`

Minimal reproduction of https://github.com/vercel/next.js/issues/73834

```bash
npm install
npm run build        # next build --webpack -> Failed to compile
npm run build:turbopack  # next build (Turbopack) -> succeeds
```

`app/globals.css` contains:

```css
background-image: url('https://example.com/image.png?a=1!!b=2');
```

The webpack build treats `!!` inside the url as webpack's inline-loader syntax and
emits:

```
external "https://example.com/image.png?a=1!!./b=2"
The target environment doesn't support dynamic import() syntax so it's not possible to use external type 'module' within a script
```

Reproduced on next@15.1.1-canary.1 and next@16.3.1-canary.25 (webpack). Turbopack builds fine.
