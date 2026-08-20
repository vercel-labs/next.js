# Repro: `useFormStatus().pending` never stays `true` with a Radix/shadcn `Select` in the form (vercel/next.js#71895)

Minimal reproduction of https://github.com/vercel/next.js/issues/71895.

Four forms, each `<form action={formAction}>` (`useActionState`) with a 1s server action and a
submit button driven by `useFormStatus()` from a child component:

1. shadcn `Input` -> `pending` stays `true` for the whole action (correct)
2. shadcn/Radix `Select` -> `pending` flips `true` then back to `false` within ~10ms (bug)
3. native `<select>` -> correct
4. Radix `Select` + `SelectTrigger` only (no `SelectContent`) -> bug, so the portal/content is not required

The server action still resolves after 1s in every case, so only the form status is wrong.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
# in another shell (headless verification, needs `npx playwright install chromium`)
npm run repro
```

Click "Submit" in each form: the button in the `Select` forms never shows "Submitting...".

## Version matrix observed (same app, same clicks)

| next | react / react-dom | @radix-ui/react-select | Radix Select form pending |
| --- | --- | --- | --- |
| 15.0.1 | 19.0.0-rc-69d4b800-20241021 | 2.1.2 | broken |
| 15.0.1 | 19.2.0 | 2.1.2 | broken |
| 15.0.1 | 19.0.0-rc | 2.3.7 | broken |
| 15.5.23 | 19.2.0 | 2.1.2 | broken |
| 16.3.1 | 19.2.8 | 2.1.2 | works |
| 16.3.1 | 19.2.8 | 2.3.7 | works |

So it is independent of the installed React / Radix version and is fixed by Next 16
(which ships a newer bundled React than 15.x, `19.2.0-canary-0bdb9206-20250818` in 15.5.23).
