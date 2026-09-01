# Turbopack: worker emitted via `new Worker(new URL(…, import.meta.url))` keeps an unrewritten sibling import

Reproduction for https://github.com/vercel/next.js/issues/98137 (Next.js 16.3.3, Turbopack, default).

## Run

```bash
npm install
npx next build
node verify.mjs      # static check: dangling ./sibling.mjs import inside the emitted worker
npx next start       # open http://localhost:3000 (minimal case) and /maplibre (original report)
```

## What happens

`app/worker-demo.tsx` builds the worker URL with a dynamic segment (exactly what maplibre-gl 6.x does):

```js
const name = isDev ? 'entry-dev.mjs' : 'entry.mjs';
new Worker(new URL(`./worker/${name}`, import.meta.url), { type: 'module' });
```

Turbopack copies `app/worker/entry.mjs` verbatim into `/_next/static/media/entry.<hash>.mjs` (file asset, no
bundling) and emits `sibling.mjs` only under a content-hashed name, but leaves the import inside the copied
worker untouched:

```
entry.<hash>.mjs
  imports "./sibling.mjs" -> MISSING in .next/static/media (404 at runtime)
```

Runtime, observed in Chromium:

```
200 /_next/static/media/entry-dev.<hash>.mjs
404 /_next/static/media/sibling.mjs
worker onerror, message="" (empty)
```

`/maplibre` is the originally reported case: the emitted `maplibre-gl-worker.<hash>.mjs` contains
`from"./maplibre-gl-shared.mjs"` while only `maplibre-gl-shared.<hash>.mjs` exists (`node verify.mjs` lists it).
At runtime maplibre 6.6.0 additionally short-circuits on its own `/^https?:/.test(import.meta.url)` guard,
because Next replaces client-side `import.meta.url` with a `file://` path under both Turbopack and `--webpack`,
so it ends up in `new Worker("")` — the second failure mode described in the issue.

Also note: the emitted URL is resolved at build time to the *first* glob match, so the runtime value of `name`
is ignored (`entry.mjs` is requested as `entry-dev.<hash>.mjs`).

Note: when the pattern is fully static (`new URL('./worker/entry.mjs', import.meta.url)`), Turbopack instead
emits a real bundled worker chunk (`static/chunks/turbopack-worker-*.js`) and everything works — only the
dynamic-segment form falls back to raw, unrewritten file emission.

## Expected

Rewrite imports inside a file emitted through `new URL(…, import.meta.url)` used as a worker entry (or emit it
as a bundled worker chunk), so the emitted asset is self-consistent.
