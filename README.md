# Reproduction for vercel/next.js#42159 — `next/link-passhref` ESLint rule

Issue: docs referenced a `next/link-passhref` ESLint rule that is not in `@next/eslint-plugin-next`.

## Run

```bash
npm install --legacy-peer-deps
npm run list-rules      # prints the shipped rules; 'link-passhref' is absent
npm run lint            # default next config: no diagnostic for the missing passHref
npm run lint:passhref   # enabling the documented rule fails: rule does not exist
```

`pages/index.jsx` uses `<Link legacyBehavior>` wrapping a custom component that renders `<a>` without `passHref` — the case the removed rule used to flag (rule removed in vercel/next.js#36511).

## Result (Next 16.3.1 / eslint-config-next 16.3.1, ESLint 9)

- `npm run list-rules` → `has 'link-passhref': false`
- `npm run lint:passhref` → `TypeError: Key "rules": Key "next/link-passhref": Could not find "link-passhref" in plugin "next"`
- The current docs (`/docs/pages/api-reference/components/link`, `/docs/app/api-reference/config/eslint`) no longer mention `passhref` at all, so the docs half of the report is already fixed; only the rule remains absent.
