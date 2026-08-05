# Repro: dev indicator gets stuck when dragged with touch (next.js#96634)

Mirrors https://github.com/klmkyo/nextjs-devtools-drag-bug-demo with an automated
Playwright/CDP check that injects real touch input.

## Run

```bash
pnpm install            # installs next@canary
pnpm dev                # http://localhost:3000
node scripts/repro.mjs        # touch drag  -> BUG: indicator stuck
node scripts/control-mouse.mjs # mouse drag -> works (snaps to top-left)
```

`scripts/repro.mjs` needs `playwright` available (`npm i playwright && npx playwright install chromium`).

## Observed (next 16.3.0-preview.10 / canary)

Touch drag up from the indicator scrolls the page, Chrome fires `pointercancel`
and never `pointerup`. `useDrag` in
`packages/next/src/next-devtools/dev-overlay/components/errors/dev-tools-indicator/draggable.tsx`
only listens for `pointermove`/`pointerup`, so the drag never ends:

```
during: scrollY=165, translate="2px -15px", class="dev-tools-grabbing", body user-select=none
after touchend: unchanged (still stuck); a subsequent tap does nothing
events: pointerdown, touchstart, pointermove, touchmove, pointercancel, touchmove..., touchend
```

Mouse control run ends cleanly: indicator animates to top-left (y=20), no
`dev-tools-grabbing` class, `user-select` cleared.
