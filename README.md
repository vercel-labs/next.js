# Repro: Pages Router is missing an "Upgrading to Version 15" guide (#74549)

Issue: https://github.com/vercel/next.js/issues/74549

Documentation-only issue, so the reproduction is a verification script that checks both
the published docs site and the docs sources on `vercel/next.js@canary`.

```bash
node verify-docs-gap.mjs
```

Exits 1 (reproduced) while `docs/02-pages/02-guides/upgrading/version-15.mdx` does not exist
and `/docs/pages/guides/upgrading` does not link a Version 15 guide.
