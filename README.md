# Repro: Turbopack breaks `light-dark()` in custom properties (next.js#82559)

Turbopack's Lightning CSS pass lowers `light-dark()` into the
`var(--lightningcss-light, ...) var(--lightningcss-dark, ...)` polyfill, but never emits the
`--lightningcss-light` / `--lightningcss-dark` definitions, so the custom property resolves to an
invalid value and the background renders transparent/white. Webpack (`next dev` without
`--turbopack`) keeps `light-dark()` intact.

## Run

```bash
npm install
npm run dev        # webpack:   #box background = rgb(249, 249, 249)
npm run dev:turbo  # turbopack: #box background = rgba(0, 0, 0, 0)
```

Open http://localhost:3000 and inspect `#box`.

Observed CSS served by each bundler (`app/globals.css`):

- webpack: `--my-bg: light-dark(hsl(0deg 0% 97.5%), hsl(0deg 0% 10.5%));`
- turbopack: `--my-bg: var(--lightningcss-light, #f9f9f9) var(--lightningcss-dark, #1b1b1b);`

Reproduced with next 15.4.6 and next@canary 16.3.1-canary.26 (canary also affected in
`next build`, since Turbopack is the default bundler there).
