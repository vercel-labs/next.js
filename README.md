# Pages Router `deploymentId` version skew (undocumented, added in 16.2)

Issue: https://github.com/vercel/next.js/issues/97632

Reproduces the behavior added by #89325 (Next.js 16.2): in the **Pages Router**, a
configured `deploymentId` now forces a **hard navigation (full page load)** when a
`/_next/data` response carries a different `x-nextjs-deployment-id`. The Pages Router
self-hosting guide never mentions `deploymentId` or version skew.

## Setup

Two production builds of the same Pages Router app behind a "load balancer" (`:3000`):

| pod | port | `deploymentId` |
| --- | ---- | -------------- |
| old | 3001 | `deploy-old`   |
| new | 3002 | `deploy-new`   |

The LB serves HTML + assets from the old pod and routes `/_next/data/*` to the new pod,
i.e. a tab opened before a rollout whose data request lands on a new pod.
`generateBuildId` is pinned so the two pods differ **only** by `deploymentId`
(otherwise a differing buildId 404s the data request for unrelated reasons).

## Run

```bash
pnpm install
npx playwright install chromium
DPL=deploy-old DIST_DIR=.next-old       npx next build
DPL=deploy-new DIST_DIR=.next-new       npx next build
DIST_DIR=.next-old-nodpl                npx next build
DIST_DIR=.next-new-nodpl                npx next build

node repro.js                     # deploymentId configured -> hard navigation
node repro.js --no-deployment-id  # control: same skew, no deploymentId -> soft navigation
```

## Result (next@16.3.0)

```
node repro.js
[lb] /_next/data ->  new pod, x-nextjs-deployment-id: deploy-new
window.__clientSideMarker after navigation: null
HARD NAVIGATION (full page load)

node repro.js --no-deployment-id
window.__clientSideMarker after navigation: alive
soft (client-side) navigation
```

Version boundary (same repro, only `next` swapped):

| next     | deploymentId mismatch on `/_next/data` |
| -------- | -------------------------------------- |
| 16.1.0   | soft client-side navigation            |
| 16.2.0   | hard navigation                        |
| 16.3.0   | hard navigation                        |

Thrown internally as `E989`, "Loaded static props were from an outdated deployment,
forcing a hard reload" (`shared/lib/router/router.js`), which has no
`nextjs.org/docs/messages` page, unlike `E987`/`E988`.
