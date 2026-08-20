# Repro: styled-components styles injected during streaming are not merged into the head (vercel/next.js#66646)

Mirrors https://github.com/blairmcalpine/styled-components-repro (its lockfile pointed at a private
registry, so it cannot be installed outside the reporter's network) and updates it to current versions.

## Run

```bash
npm install
npm run dev        # open http://localhost:3000
# or: npm run build && npm run start
```

Click "Green (click to switch)".

## Expected

The text turns blue (`Blue = styled(Green)` with `color: blue`).

## Actual

The text stays green. The suspended server component streams in a second
`<style data-styled>` tag **inside `<body>`** containing `.kPvVpT{color:green;}`. Because it comes
after the `<head>` stylesheet, the equal-specificity `green` rule wins over `blue`.

Verified: Next 14.2.3 (dev) and Next 16.3.1 + React 19 (dev and `next start` with dynamic rendering),
styled-components 6.1.11 and 6.5.3.
