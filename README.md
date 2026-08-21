# next#81374 — Sequential Focus Navigation broken with `next/link` hash links

Reproduces https://github.com/vercel/next.js/issues/81374 (mirrored from the reporter's CodeSandbox).

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
node test-focus.mjs    # in a second shell
```

## Expected

Clicking a hash link and pressing Tab should move focus to the first tabbable
element after the navigation target (sequential focus navigation start point),
and `#target:target` should match.

## Actual (next 15.5.4, dev and prod)

```json
{
  "plain-anchor": { "focusedAfterTab": "inside-target", "targetPseudoMatches": true },
  "next-link":    { "focusedAfterTab": "plain-anchor",  "targetPseudoMatches": false }
}
```

With `next/link`, Tab continues from the link itself (focus never moves into the
target), and the `:target` pseudo-class does not apply.
