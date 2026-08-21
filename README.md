# Repro: modern (stage-3) `@decorator accessor` syntax panics in Turbopack

Reproduces https://github.com/vercel/next.js/issues/81667

```bash
npm install
npm run dev   # next dev --turbopack
# open http://localhost:3000
```

`app/store.ts` contains `@observable accessor count = 0`. Turbopack's SWC
decorator transform panics:

```
thread 'tokio-rt-worker' panicked at swc_ecma_transforms_proposal-48.0.0/src/decorators/mod.rs:558:26:
not implemented: ClassMember::AutoAccessor(...)
```

which surfaces to the browser as a misleading
`Module not found: Can't resolve './store'` error and an HTTP 500 page.
No mobx is needed; a plain stage-3 accessor decorator is enough.
