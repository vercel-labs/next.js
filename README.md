# Repro: vercel/next.js#51949 — Hydration failed with FontAwesome in `pages/`

Minimal reproduction of https://github.com/vercel/next.js/issues/51949 on Next.js 16.3.1-canary.25.

## Run

```bash
npm install
npm run dev
curl -s http://localhost:3000/ | grep -c '<svg'   # => 0 (no SVG in SSR HTML)
```

Open http://localhost:3000 in a browser: the GitHub icon appears only after
hydration and React logs
`Hydration failed because the server rendered HTML didn't match the client.`

The dev server also logs `Could not find icon { prefix: 'fab', iconName: 'github' }`.

`npm run build` shows the same: `.next/server/pages/index.html` contains no `<svg>`.

## Notes

- `pages/_app.tsx` registers icons globally via `library.add(faGithub)` and
  `pages/index.tsx` renders `<FontAwesomeIcon icon={['fab', 'github']} />`.
- A page that imports `@fortawesome/fontawesome-svg-core` itself sees the
  populated library during SSR, while `@fortawesome/react-fontawesome` does not —
  the CJS (`index.js`) and ESM (`index.mjs`) builds of
  `@fortawesome/fontawesome-svg-core` end up as two separate singletons on the
  server (classic dual-package hazard).
- With Next 13.4.8-canary.8 the reporter's workaround (adding an `app/`
  directory) made SSR work; on 16.3.1-canary.25 it no longer helps.
