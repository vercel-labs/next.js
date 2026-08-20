# Repro: vercel/next.js#43043 — inline `next/script` missing from exported HTML

    npm install
    npm run build
    grep -o 'id="lime[a-z-]*"' out/index.html   # only id="lime-before"
    grep -c lime out/app-router.html            # 1, inside the RSC flight payload only

Expected: `<script id="lime">document.body.style.backgroundColor = 'lime'</script>` in `out/index.html`.
Actual (next 16.3.1-canary.25): the default-strategy (`afterInteractive`) inline script is absent from
the exported pages-router HTML; the app-router page only contains it inside the `self.__next_f` flight
payload, not as a real `<script>` tag. `strategy="beforeInteractive"` is inlined correctly.
The script still executes after hydration, so the effect flashes in late / never runs without JS.
Same result with `next start` (not export-specific).
