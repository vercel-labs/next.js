# Repro: focus lost in Firefox when `router.replace` updates the URL (vercel/next.js#54838)

The page's root DOM node is a scroll container that contains an `<input>`. Typing in
`#q` calls `router.replace('/?q=...')` on every `input` event. `#q-native` is a control
that calls `history.replaceState` instead.

## Run

```bash
npm install
npx playwright install firefox
npm run dev            # terminal 1
npm test               # terminal 2 (Firefox, automated)
node check.mjs http://localhost:3000 q-native   # control
```

Manual: open http://localhost:3000 in Firefox, click the first input, type `hello`.

## Result

| next | `#q` (router.replace) | `#q-native` (history.replaceState) |
| --- | --- | --- |
| 13.4.20-canary.13 | focus jumps to `#scroller`, only `h` is typed | keeps focus, `hello` |
| 14.2.33 / 15.0.4 / 15.5.7 / 16.0.0 / 16.1.6 / 16.2.12 | focus jumps to `#scroller`, only `h` is typed | keeps focus, `hello` |
| 16.3.1 / 16.3.1-canary.25 | keeps focus, `hello` (fixed) | keeps focus, `hello` |

Cause: up to 16.2.x, `layout-router`'s `ScrollAndFocusHandler` called `domNode.focus()`
on the changed segment's root node after every navigation. Firefox treats scroll
containers as focusable, so the call moved focus off the input. Current Next.js
replaces that handler with a Fragment-ref scroll handler that "intentionally leaves
focus untouched", so the bug no longer occurs.
