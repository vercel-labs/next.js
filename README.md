# Repro: vercel/next.js#80299 — dev-overlay Preferences `<select>` only clickable on its text

The dev overlay `Select` in `user-preferences.tsx` renders a native `<select>` with
`all: unset` inside a padded `.select-button` div (prefix icon + chevron siblings).
The `<select>` therefore only covers its own text box, so the padding, prefix icon
and chevron of the "button" are dead zones.

## Steps

```bash
npm install
npx playwright install chromium
npm run dev            # in one terminal
npm run repro          # in another terminal
```

Manual: `next dev` → click the dev tools indicator → "Preferences" → click the
chevron / padding / icon of any of the three selects: nothing happens.

## Observed (next@16.3.1-canary.26, headless Chromium)

- Theme row: `.select-button` = 111x35 px, inner `<select>` = 49x21 px (~26% of the visual button).
- `shadowRoot.elementFromPoint` at left padding, top edge and the chevron all return
  `div.select-button`, only the text center returns `select`.
- Clicking the chevron leaves `shadowRoot.activeElement` as the `div`; clicking the text focuses the `select`.

Expected: the whole `.select-button` opens the select (e.g. absolutely positioned,
transparent `<select>` stretched over the wrapper, as proposed in PR #80300).
