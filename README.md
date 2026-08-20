# Reproduction: `revalidatePath` over-invalidates descendant routes on Vercel (issue #73013)

Minimal app (Next.js 15.5.23, App Router, two ISR pages + one nested ISR page and a
revalidation route handler). `next.config.js` sets `trailingSlash: true`.

## Run

```bash
npm install
npm run build && npm start
# baseline (local): only the requested path re-renders
curl -sL "http://localhost:3000/api/revalidate/?path=/"
```

Then deploy the same directory to Vercel and repeat:

```bash
curl -sL "https://<deployment>/api/revalidate/?path=/"
curl -s "https://<deployment>/"            # timestamp changes (expected)
curl -s "https://<deployment>/some-page/"  # timestamp ALSO changes (bug)
```

Each page prints `new Date().toISOString()`, so a changed timestamp means the ISR entry
was invalidated and re-rendered.

## Observed

| action | environment | `/` | `/some-page/` | `/some-page/nested/` |
| --- | --- | --- | --- | --- |
| `revalidatePath('/')` | `next start` (local) | changed | unchanged | unchanged |
| `revalidatePath('/')` | Vercel | changed | **changed** | **changed** |
| `revalidatePath('/some-page/')` | `next start` (local) | unchanged | changed | unchanged |
| `revalidatePath('/some-page/')` | Vercel | unchanged | changed | **changed** |

So on Vercel the path tag behaves like a prefix match: every route below the revalidated
path is invalidated too, which makes `revalidatePath('/')` purge the whole site.
Reproduces with and without `trailingSlash: true` (a second deployment without
`trailingSlash` shows the same over-invalidation), so `trailingSlash` is not the trigger.
