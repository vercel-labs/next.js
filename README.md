# Repro: next/font/local `declarations` value containing `"` breaks Turbopack (#85816)

Next.js 16 (Turbopack) fails to resolve the generated font CSS module when a
`declarations` entry value contains double quotes, e.g.
`{ prop: 'font-variation-settings', value: '"wdth" 75, "slnt" 0' }`.

## Run

```bash
npm install
npm run build          # FAILS: Module not found: Can't resolve '@vercel/turbopack-next/internal/font/local/cssmodule.module.css'
npm run dev            # FAILS: same error, page returns HTTP 500
npm run build:webpack  # OK: webpack bundler unaffected
```

Workaround: use single quotes (`value: "'wdth' 75, 'slnt' 0"`), which builds fine.

Verified failing on next@16.0.1 and next@16.3.1-canary.26.

`public/fonts/MyFont.var.woff2` is Inter (SIL Open Font License 1.1), used only as a valid variable font payload.
