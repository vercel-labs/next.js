# Turbopack: `audioWorklet.addModule(new URL(...))` is emitted as a static asset, not bundled

Related issue: https://github.com/vercel/next.js/issues/78784

`new Worker(new URL('./worker/worker.js', import.meta.url))` is bundled correctly by Turbopack
(the worker's `import { GAIN } from '../shared.js'` resolves and runs).

`audioContext.audioWorklet.addModule(new URL('./worklet/worklet.js', import.meta.url))` is *not*
treated as a JS entrypoint. The file is copied verbatim into `/_next/static/media/worklet.<hash>.js`,
so its `import` statements are left untouched, the imported module 404s and `addModule()` rejects
with `AbortError: Unable to load a worklet's module.`

## Run

```bash
npm install
npm run dev      # or: npm run build && npm run start
# open http://localhost:3000 and click "run worker" then "run worklet"
```

Automated check (Chromium):

```bash
npx playwright install chromium
npm run dev &
node test.mjs
```

Expected output:

```
worker url resolved + message: worker sees GAIN=0.25
worklet url: /_next/static/media/worklet.<hash>.js
worklet served bytes: 264
worklet contains bare import: true
addModule FAILED: AbortError: Unable to load a worklet's module.
```

Serving the emitted worklet file shows the untransformed source:

```
$ curl http://localhost:3000/_next/static/media/worklet.<hash>.js
import { GAIN } from "../shared.js";
...
```

Next.js 16.3.1, Turbopack (dev and `next build --turbopack`).
