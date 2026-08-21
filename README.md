# Repro: `next/form` does not send `name`/`value` of the submitting `<button type="submit">`

Upstream issue: https://github.com/vercel/next.js/issues/84857

## Run

```bash
npm install
npm run dev            # or: npm run build && npm run start
# then, in another shell:
npx playwright install chromium
npm run verify
```

Or manually: open `/`, click **Submit** in the `next/form` form, then go back and click
**Submit** in the vanilla HTML form, and compare the URL / rendered search params on `/target`.

## Actual

| form | resulting URL |
| --- | --- |
| `next/form` | `/target?query=hello` |
| vanilla `<form method="get">` | `/target?query=hello&intent=save` |

## Expected

Both should produce `/target?query=hello&intent=save`. The submitter button's
`name`/`value` pair is part of the form entry list per the HTML spec.

## Cause

`createFormSubmitDestinationUrl` in `packages/next/src/client/form-shared.tsx` builds
`new FormData(formElement)` without passing the `submitter` argument, so the submit
button's entry is never included.

Reproduced on `next@16.0.0-canary.4` (as reported) and `next@16.3.1-canary.26`,
in both `next dev` and `next start`.
