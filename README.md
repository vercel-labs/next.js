# Reproduction for vercel/next.js#97020

Turbopack dev keeps manifests for deleted App Router pages, so a newly added
optional catch-all 404s with
`You cannot define a route with the same specificity as a optional catch-all route`
until the dev server is restarted.

## Run

```bash
npm install
bash reproduce.sh
```

## Observed (next 16.3.0 and 16.3.1-canary.10)

- before change: `/project` 200, `/project/acme/home` 200
- after deleting `app/[locale]/project/page.js` + `app/[locale]/project/[projectId]/home/page.js`
  and adding `app/[locale]/project/[[...slug]]/page.js` while dev is running:
  all of `/project`, `/project/acme/home`, `/project/acme/schedule`, `/en/project/acme/schedule` return 404
- `.next/dev/server/app-paths-manifest.json` still lists the deleted routes
- restarting `next dev --turbopack` makes all four return 200 with a clean manifest

## Expected

Deleted pages should be removed from the partial manifests / route matchers without a restart.
