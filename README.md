# Repro: next#53821 — browserslist `supports es5` not applied to Next.js runtime chunks

Reproduces https://github.com/vercel/next.js/issues/53821 on Next.js canary (16.3.1-canary.25).

`package.json` sets `"browserslist": [">0.3%, defaults, supports es5"]`.
Minification is disabled in `next.config.js` so the syntax is readable.

## Run

```bash
npm install
npm run build          # webpack build (next build --webpack)
npx es-check es5 '.next/static/chunks/*.js'
```

## Expected

All emitted client chunks are ES5.

## Actual

`main-*.js`, `framework-*.js` and `webpack-*.js` fail es-check es5:
they contain `const`, `let`, destructuring and arrow functions coming from
prebundled `next/dist` code and the webpack runtime (`output.environment`).
Application code itself *is* correctly downleveled to `var`/`function`.

Workaround reported in the issue: `transpilePackages: ['next']`.

The Turbopack build (`next build`, Next 16 default) also emits non-ES5 chunks.
