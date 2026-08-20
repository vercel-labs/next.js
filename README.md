# Repro: Next.js #56451 — middleware/proxy `config` ignored with grouped export statement

Next.js only recognizes `config` when it is exported via `export const config = ...`.
When `config` is exported through a grouped export statement (`export { middleware, config }`),
Next.js logs `Next.js can't recognize the exported 'config' field ...` and applies the
default config, so the middleware runs on every request (including `/_next/static/*` and `*.svg`).

## Run

```bash
npm install
npm run dev            # terminal 1
npm run check          # terminal 2
```

Observed (grouped exports, `middleware.ts` as committed):

```
⚠ Next.js can't recognize the exported `config` field in "/middleware", it may be re-exported from another file. The default config will be used instead.
MIDDLEWARE: http://localhost:3000/
MIDDLEWARE: http://localhost:3000/vercel.svg
```

Expected: `/vercel.svg` is excluded by `config.matcher`, so only `/` is logged
(which is what happens with `export const middleware` / `export const config`).

Also reproduces with the new `proxy.ts` convention on Next 16 canary
(`export { proxy, config }` → same warning, matcher ignored).
