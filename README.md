# Reproduction — next.js#98077

`experimental.runtimeServerDeploymentId` resolves the deployment id at runtime for
the server, but prerendered App Router artifacts still carry the **build-time**
deployment id (`data-dpl-id` in the prerendered HTML, the `?dpl=` asset queries,
and the `x-nextjs-deployment-id` header rule baked into
`.next/routes-manifest.json`). Serving a `.next` built under deployment **A** as
deployment **B** therefore makes the client initialize its navigation build id
with **A** while runtime (dynamic) responses report **B**, so the skew check
turns every client navigation into a full-page MPA reload.

Next.js 16.3.3, `experimental.runtimeServerDeploymentId: true`.

## Setup

```bash
npm install
npx playwright install chromium
```

## Run

```bash
./scripts/build-a.sh        # build with NEXT_DEPLOYMENT_ID=dpl_AAAA…
./scripts/run.sh            # serve the same .next with NEXT_DEPLOYMENT_ID=dpl_BBBB… + CDN emulator on :3100
node scripts/navigate.js    # Playwright: 3 client navigations, reports hard reloads
node scripts/stop.js        # stop servers
```

`scripts/run.sh` starts two processes:

- `scripts/serve-b.sh` — `next start` with `NEXT_PRIVATE_MINIMAL_MODE=1` and
  `NEXT_DEPLOYMENT_ID=dpl_BBBB…` on `:3001` (the "deployment B" function),
- `scripts/cdn.js` on `:3100` — ~40 lines emulating the Vercel network layer:
  the prerendered route `/` is served from the static build artifacts
  (`.next/server/app/index.html` / `index.rsc`, plus the deployment-id header
  rule from `routes-manifest.json`), everything else is forwarded to the
  function.

## Observed (bug)

```
initialDeploymentIdInPrerenderedHtml: dpl_AAAAAAAAAAAAAAAAAAAAAAAA
GET /?_rsc        -> x-nextjs-deployment-id: dpl_AAAAAAAAAAAAAAAAAAAAAAAA   (prerendered artifact)
GET /dynamic?_rsc -> x-nextjs-deployment-id: dpl_BBBBBBBBBBBBBBBBBBBBBBBB   (runtime)
nav1 / -> /dynamic was full page reload: true
nav2 /dynamic -> / was full page reload: true
nav3 / -> /dynamic was full page reload: true
documentLoadUrls: ["/", "/dynamic", "/", "/dynamic"]
```

Every navigation is a hard reload, and it never converges: landing on the
prerendered page resets the client id to `A`, landing on a runtime-rendered page
sets it to `B`.

## Control (same id at build and serve time)

```bash
./scripts/build-b.sh && ./scripts/run.sh && node scripts/navigate.js
```

```
documentLoadsTotal: 1
nav1/nav2/nav3 was full page reload: false
```

## Notes

- With `deploymentId` set, `maybeAppendBuildIdToRSCPayload`
  (`server/app-render/app-render.ts`) omits `b` from the RSC payload, so the
  client falls back to `getDeploymentId()` → `document.documentElement.dataset.dplId`,
  which for a prerendered page is the build-time value.
- `.next/routes-manifest.json` also embeds the build-time id (`deploymentId` and
  the `onMatchHeaders` `x-nextjs-deployment-id` rule) even when
  `experimental.runtimeServerDeploymentId` is enabled.
