# Repro: `revalidatePath` + `trailingSlash: true` on Vercel (vercel/next.js#59836)

Minimal App Router app with `trailingSlash: true`:

- `/time/` – statically prerendered page printing `Date.now()`
- `/blog/[slug]/` – `force-static` + `generateStaticParams()` → `/blog/prebuilt/` is built at build time
- `/api/revalidate/?path=<path>` – route handler calling `revalidatePath(path)`

## Run

```bash
npm install
npm run build && npm start
./verify.sh http://localhost:3000       # local: passes
```

Deploy the same directory to Vercel and run `./verify.sh https://<deployment>`.

## Results observed

| Next.js | `trailingSlash` | environment | `revalidatePath('/time/')` | `revalidatePath('/time')` |
| --- | --- | --- | --- | --- |
| 16.1.6 | `true` | Vercel | no effect (timestamp frozen) | no effect |
| 16.1.6 | `false` | Vercel | n/a | works |
| 16.1.6 | `true` | `next start` | works | works |
| 16.3.1-canary.25 | `true` | Vercel | works | works |
| 16.3.1-canary.25 | `true` | `next start` | works | works |

To reproduce the failure, pin `next` to `16.1.6` (and `typescript@5`) in `package.json` and redeploy;
build-time prerendered pages then never revalidate on Vercel while `trailingSlash: true`.
