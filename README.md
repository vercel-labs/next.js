# Reproduction harness for vercel/next.js#51213

Multi-file CSS import order in `app/layout.js`.

`src/app/layout.js` imports, in order: `globals.css` (blue), `green.css` (green),
`z.css` (black), `yellow.css` (yellow). Because all four files declare `div { color: ... }`
the rendered text must be **yellow** and the emitted stylesheet must keep that order.

## Run

```bash
npm install
npm run build        # Turbopack (default in Next 16)
npm start &
npm run verify       # prints the emitted CSS declaration order
# or open http://localhost:3000 -> text must be yellow
npm run build:webpack # same check with the webpack builder
```

## Results

* next@13.4.7 (version reported in the issue): emitted order is
  `blue, yellow, green, black` — `yellow.css` is hoisted, text renders **black**. Bug reproduces.
* next@16.3.1-canary.25, Turbopack and webpack builders: emitted order is
  `blue, green, black, yellow`, text renders **yellow**. Bug does not reproduce.
  Repeated rebuilds after editing `layout.js` produce identical, stable output.
