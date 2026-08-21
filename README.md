# vercel/next.js#95397 — `?dpl=` suffix on dynamically rendered routes

Reporter's app (https://github.com/Adophlidu/next-dpl-undefined-repro) plus:

* `app/edge/page.tsx` — same page on the edge runtime.
* `app/api/probe2/route.ts` — dumps the deployed function's runtime config
  (`.next/required-server-files.json`) and env.
* `repro.sh` — local simulation of a **standard Vercel build**: builds with
  `NOW_BUILDER=1` + `NEXT_DEPLOYMENT_ID` (which makes
  `packages/next/src/server/config.ts` auto-enable
  `experimental.runtimeServerDeploymentId`), then serves with and without
  `NEXT_DEPLOYMENT_ID` in the *runtime* env.

## What actually happens (next 16.2.6)

Deployed on Vercel (standard build, Hobby-style project, no skew-protection
settings): `rsdi=true`, `deploymentId=""` in `required-server-files.json`, and
`NEXT_DEPLOYMENT_ID` **is** present in the function env, so `/` and `/dyn` both
emit `20 dpl=dpl_<id>` and **no `dpl=undefined`** — the reported symptom did not
reproduce. On `next@canary` (16.3.1-canary.26) the Vercel build sets
`supportsImmutableAssets: true`, so chunk URLs carry no `?dpl=` at all.

## The fragile mechanism (reproduces locally, `./repro.sh`)

Turbopack appends the suffix to client-reference-manifest chunks at *eval* time,
unguarded:

```js
val.chunks = val.chunks.map((c) => `${c}?dpl=${process.env.NEXT_DEPLOYMENT_ID}`)
```

`server/load-manifest.external.ts` evaluates that file with
`{ process: { env: { NEXT_DEPLOYMENT_ID: process.env.NEXT_DEPLOYMENT_ID } } }`,
so whatever the runtime env holds is stringified straight into the URL
(`undefined` when unset in a context that does not go through
`base-server`'s guard).

When the runtime value differs from the build-time one, dynamic routes reference
the *same* chunk twice in one document — once from the entry scripts and once
from the manifest with a different suffix — while the prerendered `/` keeps the
build-time id:

```
/     -> 20 dpl=dpl_test123456
/dyn  -> 12 dpl=            # + the same chunks again without any suffix
/edge -> 12 dpl=
```
