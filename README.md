# Repro: dev tools indicator gets stuck after a cancelled touch drag (vercel/next.js#96634)

Mirrors https://github.com/klmkyo/nextjs-devtools-drag-bug-demo and adds an automated
Playwright + CDP script that dispatches a real touch drag, so the bug can be observed
without a physical device.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
xvfb-run -a node touch-drag-repro.mjs   # terminal 2 (headed Chromium is required:
                                        # the headless shell does not do touch scrolling)
```

The script emulates a Pixel 7 (touch), dispatches `Input.dispatchTouchEvent`
touchStart/touchMove/touchEnd upward from the indicator, and prints the indicator state.

## Observed (next@16.3.1-canary.3)

```
BEFORE  dragging: []                                  bodyUserSelect: ""
MID2    dragging: [dev-tools-grabbing, translate -2px -20px]  bodyUserSelect: "none"  events: pointerdown, pointermove, pointercancel, lostpointercapture
AFTER   dragging: [dev-tools-grabbing, translate -2px -20px]  bodyUserSelect: "none"  scrollY: 363
AFTER_TAP panelOpen: false
```

The page scrolls, `pointercancel` fires and no `pointerup` ever arrives, so `useDrag`
never runs its cleanup: the indicator keeps the drag translate/class, `user-select: none`
stays on `document.body`, and a later tap no longer opens the DevTools panel.

Source: `packages/next/src/next-devtools/dev-overlay/components/errors/dev-tools-indicator/draggable.tsx`
registers only `pointermove`/`pointerup` (no `pointercancel`, no `touch-action: none`).
