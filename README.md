# Repro: next.js#59825 — revalidatePath with middleware rewrite (multi-tenant)

Minimal repro of https://github.com/vercel/next.js/issues/59825, adapted from
https://github.com/sergiolamorda/nextjs-issue-revalidatePath-multitenant
(async `params` for Next 15/16).

Middleware rewrites `/<path>` to `/<host>/<path>`; route is `app/[domain]/[[...slug]]`,
`force-static`. The page prints a timestamp so cache invalidation is observable.

## Run

```bash
NEXT_VERSION=14.0.4 ./verify.sh   # buggy
NEXT_VERSION=15.5.4 ./verify.sh   # buggy
NEXT_VERSION=canary  ./verify.sh  # correct
```

No `/etc/hosts` edit needed: the script sends `Host: test1.local` / `Host: test2.local`
to `localhost`, which is what the middleware reads.

## Results

| next | revalidatePath('/test2.local/test') | revalidatePath('/test') |
| --- | --- | --- |
| 14.0.4 | no effect (bug) | invalidates BOTH tenants (bug) |
| 15.5.4 | no effect (bug) | invalidates BOTH tenants (bug) |
| 16.3.1-canary.25 | invalidates only test2.local (expected) | no effect (expected) |
