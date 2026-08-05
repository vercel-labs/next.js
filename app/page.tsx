export default function Home() {
  return (
    <div style={{ height: '200vh', padding: 16 }}>
      <p>
        On a touch device, drag up (or diagonally) starting from the Next.js
        DevTools indicator. The browser takes over the gesture as a viewport
        scroll, the indicator receives `pointercancel` instead of `pointerup`,
        and it stays stuck (translated, `.dev-tools-grabbing`,
        `body { user-select: none }`) until a reload.
      </p>
      <p>Run `node touch-drag-repro.mjs` to reproduce headlessly.</p>
    </div>
  )
}
