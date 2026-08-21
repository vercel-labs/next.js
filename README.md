# Repro: `.nft.json` lists a Turbopack external's hashed alias but not its target files

Minimal reproduction for [vercel/next.js#95816](https://github.com/vercel/next.js/issues/95816)
(the issue's own repo, `cipriancaba/next-turbopack-nft-ssr-chunk-repro`, reports `PASS` on
`16.3.0-preview.6` — verified — so this is a smaller, independently failing shape).

## Shape

A single App Router page renders a `'use client'` component that imports a `'use server'`
action module, and only that action module imports the `serverExternalPackages` entry
(`nanoid` here — any externalized package works).

```
app/a/page.tsx    ->  app/ai-widget.tsx ('use client')  ->  app/actions.ts ('use server')  ->  nanoid (external)
```

## Run

```bash
bun install          # bun isolated linker (bunfig.toml) -> node_modules/.bun store
bun run build        # NODE_ENV=production next build (Turbopack)
node check-nft.mjs   # per-endpoint nft verifier
node pack-from-nft.mjs   # rebuild the lambda from that endpoint's trace only, then:
node --input-type=module -e "import fs from 'node:fs'; const d='/tmp/packed/.next/node_modules'; await import(d+'/'+fs.readdirSync(d)[0]+'/index.js')"
```

`check-nft.mjs` walks every `.next/server/**/*.nft.json`; for each content-hashed external
alias (`.next/node_modules/<pkg>-<hash>`) the trace lists, it checks whether files from the
alias's realpath target are listed in the *same* trace.

## Result

```
next@16.3.0-preview.6   server/app/a/page.js.nft.json  alias=nanoid-<hash>  DANGLING (0 target files)   FAIL
next@16.3.0-canary.86   FAIL
next@16.3.0-canary.87   FAIL
next@16.3.0-canary.88   PASS (3 target files)
next@16.3.0             PASS
next@16.3.1             PASS
next@16.3.1-canary.26   PASS
next@16.2.9             PASS
```

`pack-from-nft.mjs` rebuilds the lambda from only that endpoint's traced files; on the failing
versions the alias symlink is packed with no target, and importing it fails with
`ERR_MODULE_NOT_FOUND` — the HTTP 500 described in the issue.

Fixed upstream by "Turbopack: trace externals imported only by server actions" (#95824),
first released in `16.3.0-canary.88`. The issue's other reported variant (an external reached
from a *shared* SSR-layer chunk of a route that does not own the import) could not be
reproduced on any tested version.
