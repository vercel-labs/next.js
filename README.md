# Repro: Sass `:export` from CSS Modules is ignored by Turbopack (next.js#88544)

Docs (https://nextjs.org/docs/app/guides/sass#sass-variables) say Next.js supports Sass
variables exported from CSS Module files via `:export`. That only works with webpack.

```bash
npm install
npm run dev:turbo    # http://localhost:3000  -> keys: []            primaryColor: undefined
npm run dev:webpack  # http://localhost:3001  -> keys: ["primaryColor","__checksum"]  primaryColor: #64ff00
```

Next.js 16.3.1: Turbopack (default bundler) compiles the file with no warning/error, but the
CSS Module default export contains no `:export` keys, so `variables.primaryColor` is `undefined`
and the `<h1>` renders without an inline color.
