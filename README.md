# Repro: auto-enabled `experimental.runtimeServerDeploymentId` overrides the custom `deploymentId` at runtime

Upstream issue: https://github.com/vercel/next.js/issues/94734

`vercel build` sets `NOW_BUILDER=1` (so `ciEnvironment.hasNextSupport === true`). With
`NEXT_DEPLOYMENT_ID` set, `packages/next/src/server/config.ts` auto-enables
`experimental.runtimeServerDeploymentId`, and the runtime then reads
`process.env.NEXT_DEPLOYMENT_ID` (where Vercel injects the platform `dpl_...` ID)
instead of the build-time custom ID that prebuilt Skew Protection pins by.

This repro reproduces the Next.js half of the bug **without Vercel**: it builds with
`NOW_BUILDER=1 NEXT_DEPLOYMENT_ID=custom-old` (like `vercel build`) and serves the
standalone output with a different runtime `NEXT_DEPLOYMENT_ID=dpl_RuntimeInjectedId`
(like the Vercel runtime env of a prebuilt deployment).

## Run

```bash
npm install
./repro.sh                                  # current behavior
REPRO_DISABLE_RUNTIME_ID=1 PORT=3101 ./repro.sh   # reporter's workaround
```

## Result (next@16.2.6)

`./repro.sh`

```
routes-manifest.deploymentId = custom-old      <- the prebuilt skew-pinning key
config.deploymentId       = ""
experimental.runtimeServerDeploymentId = true   <- auto-enabled, not requested
data-dpl-id="dpl_RuntimeInjectedId"            <- what clients send back
dpl=dpl_RuntimeInjectedId
```

`REPRO_DISABLE_RUNTIME_ID=1 ./repro.sh`

```
routes-manifest.deploymentId = custom-old
config.deploymentId       = "custom-old"
experimental.runtimeServerDeploymentId = false
data-dpl-id="custom-old"                       <- matches routes-manifest, pins correctly
```

The Vercel-only part of the report (that `x-deployment-id: dpl_<old>` is not pinned while
`x-deployment-id: custom-old` is) needs a Vercel Pro project with Skew Protection and
cannot run in a sandbox.

Note: even with `runtimeServerDeploymentId: false`, `loadConfig` still does
`result.deploymentId = process.env.NEXT_DEPLOYMENT_ID` unconditionally, so a server that
re-loads `next.config.js` at runtime (e.g. `next start`) still emits the runtime ID.
