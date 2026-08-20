# Repro: next.js#39516 — "Global CSS cannot be imported from within node_modules" for pre-scoped CSS

`vendor/fake-lib` mimics a published package (e.g. `@cloudscape-design/components`) that ships
already-scoped CSS in `*.scoped.css` files and imports them from its own JS. A `postinstall` script
copies it into `node_modules/fake-lib` so the import really originates inside `node_modules`.

Run with the default (empty) Next config:

```bash
npm install
npm run build          # next build --webpack  -> "Global CSS cannot be imported from within node_modules."
npm run build:turbopack # next build           -> "Failed to load external module fake-lib...: SyntaxError: Unexpected token '.'"
```

Adding `transpilePackages: ['fake-lib']` to `next.config.js` makes both builders succeed,
i.e. the workaround is still required. Verified on next@16.3.1-canary.25.
