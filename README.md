# Repro: Bun runtime on Vercel renders the wrong route module for rewritten paths

Minimal reproduction for https://github.com/vercel/next.js/issues/96194, refreshed to Next.js
`16.3.0-canary.97` and next-intl `4.13.4`.

## What it shows

With the **Bun runtime** enabled on Vercel (`"bunVersion": "1.x"` in `vercel.json`), requests to
the *unprefixed* default-locale routes intermittently return the **root page's** HTML with
HTTP 200, or fail with HTTP 500 and `ResolveMessage {}` in the runtime logs.

`next-intl` is configured with `localePrefix: 'as-needed'`, so `/alpha` has to be rewritten to
`/[locale]/alpha?nxtPlocale=en` while `/pt/alpha` matches directly. Only the rewritten path fails.

The routing metadata on a failing response is correct — `x-matched-path`, the `hreflang` `link`
headers and the `NEXT_LOCALE` cookie are all right — so the proxy ran and rewrote correctly. What
comes back is the wrong rendered module.

## Reproduce

```bash
bun install
```

Deploy to Vercel, then:

```bash
./check.sh https://<your-deployment>.vercel.app 40
```

Expected: zero failures. Observed on the Bun runtime: `/alpha`, `/beta`, `/gamma` fail a fraction
of the time with the title `ROOT PAGE`; `/pt/*` never fails.

To confirm the runtime is the trigger, remove `bunVersion` from `vercel.json`, redeploy, and run
the same script.

## Reporter measurements before the canary refresh

Two deployments of the reporter's original project, differing only in `vercel.json`:

| Route | Bun runtime | Node runtime |
| --- | --- | --- |
| `/alpha` | 7 / 40 failed | 0 / 40 |
| `/beta` | 4 / 40 failed | 0 / 40 |
| `/gamma` | 7 / 40 failed | 0 / 40 |
| `/pt/alpha` | 0 / 40 | 0 / 40 |
| `/pt/beta` | 0 / 40 | 0 / 40 |
| `/pt/gamma` | 0 / 40 | 0 / 40 |

Every failure was HTTP 200 carrying the root page's HTML (`<title>ROOT PAGE</title>`), on an
unprefixed route. The locale-prefixed equivalents, which do not need the rewrite, never failed.

On a larger real-world app the same setup also produces HTTP 500 with `ResolveMessage {}` in the
runtime logs on dynamic segments; this minimal app only surfaces the silent 200 variant.

## Note on sample size

The failure rate is a fraction of requests, so a handful of requests can easily come back clean.
Run at least 40 iterations before concluding either way.

`check.sh` is POSIX-ish on purpose so it runs on the bash 3.2 that ships with macOS.
