# Repro: `this._compilation` is undefined for webpack loaders in Turbopack

Issue: https://github.com/vercel/next.js/issues/89599

A probe loader is applied to `*.macro.js` through both `turbopack.rules` and the
webpack config. It logs `typeof this._compilation` and the object identity per
invocation.

```
npm install
npm run dev:turbopack   # then open http://localhost:3000
npm run dev:webpack     # then open http://localhost:3001
```

Turbopack logs `typeof this._compilation=undefined` for every invocation, so a
loader cannot key a per-compilation cache (WeakMap) across the three files.
Webpack logs `object` with one shared identity for all three files.
