# Repro: vercel/next.js#77200 — `next/link.js` causes a hard reload

Minimal, dependency-clean rebuild of the reporter's repro
(https://github.com/amannn/nextjs-bug-repro-linkjs @ eedf0a9). The reporter's
HEAD (`cd3145e`) is not installable because it depends on a package via an
SSH git URL (`git@github.com:...`), so this version drops that and adds a
`/control` route plus automated navigation checks.

- `/` imports `Link` from `next/link.js` (ESM-spec-compliant specifier)
- `/control` imports `Link` from `next/link`

## Steps

```bash
npm install
npm run dev            # next dev --turbopack
# in another shell:
npx playwright install chromium
npm run nav-test
```

Observed with `next@15.3.0-canary.11` (as reported):

```
{"label":"import Link from 'next/link.js'","url":".../test","navigation":"HARD","loadEvents":["/","/test"]}
{"label":"import Link from 'next/link' (control)","url":".../test","navigation":"SOFT","loadEvents":["/control"]}
```

The `next/link.js` page fires a second `load` event and loses in-page JS state
→ full document reload. The control page soft-navigates.

## Status on current canary

With `next@canary` (verified on `16.3.1-canary.26`, Turbopack) **both** routes
soft-navigate — the hard-reload symptom is fixed. Bump the `next` dependency to
`canary` and re-run `npm run nav-test` to confirm.

The broader ESM request in the issue is still open: `next` has no `exports`
field, so plain Node ESM resolution still fails:

```bash
npm run esm-resolve-test
# next/link: FAIL ERR_MODULE_NOT_FOUND
# next/link.js: OK
# next/navigation: FAIL ERR_MODULE_NOT_FOUND
```
