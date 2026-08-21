# next#97668 — dev tools indicator bubble freezes when dragged with touch

Minimal reproduction for https://github.com/vercel/next.js/issues/97668 (next@16.3.1).

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
npm run repro          # terminal 2 — mobile/touch emulation (bug)
npm run repro:mouse    # terminal 2 — desktop mouse (works)
```

The script emulates a Galaxy S9+ (`hasTouch`) via CDP `Input.dispatchTouchEvent`, presses the
`#next-logo` dev tools bubble, and drags 300px while logging the element offset after each move.

## Result

Touch (`npm run repro`): the bubble stops at `dx=20 dy=-20` while the finger keeps moving to 300px.
The window receives only 2 `pointermove` events, then a `pointercancel`, and 29 `touchmove` events.

Mouse (`npm run repro:mouse`): the bubble tracks the cursor to `dx=301 dy=-299`, 31 `pointermove`, no cancel.

## Cause

The drag hook (`next/dist/next-devtools/.../draggable`) listens for `pointermove`/`pointerup` on `window`
after `pointerdown` but does not call `setPointerCapture`, does not set `touch-action: none` on the bubble
(computed `touch-action` is `auto`), and has no `pointercancel` handler. Once the browser's touch scroll
slop threshold (~25-30px) is exceeded, it takes the gesture over for panning and emits `pointercancel`,
so the drag freezes.
