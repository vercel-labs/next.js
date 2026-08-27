# Repro harness for vercel/next.js#97990

Server Action via `useActionState` intermittently never commits on the client
(`isPending` stuck true) in production builds.

The reporter's app is a private repo. This is a minimal harness modelled on every
trigger correlate described in the issue:

- App Router, no `cacheComponents`
- `useActionState` + `<form action={dispatch}>` server action that calls `revalidatePath('/')`
- server component passing a **client component element as a prop** into a client component
- `useId` in client components, `Suspense` boundaries, `next/dynamic` (`ssr: false`) lazy client reference
- 40 unrelated shared modules to perturb chunk/module layout
- production only (`next build` + `next start`)

## Run

```bash
npm install\nnode gen.js 40
./sample.sh 5 16     # 5 fresh builds x 16 submissions each, logs to sample.log
```

`check.js` submits the form and waits up to 8s for `#state` to contain
`"success"` and `#pending` to read `settled`. Rounds alternate 1x/6x CDP CPU
throttling and include double-click-while-pending cases.

## Result observed here

0 hangs in 288 submissions across 18 fresh production builds:

| next | vendored react | fresh builds | submissions | hangs |
|---|---|---|---|---|
| 16.3.3 | 19.3.0-canary-cbb046ab-20260731 | 13 | 208 | 0 |
| 16.2.9 | 19.3.0-canary-3f0b9e61-20260317 (same as report) | 5 | 80 | 0 |

So the harness does not reproduce; the reported failure needs the reporter's real
bundle layout / CI environment.
