# Repro: vercel/next.js#57867

A Server Action wrapped in `useActionState` **and** created with `.bind()` never
responds when the form is submitted without client JavaScript (the progressive
enhancement path). The action body runs to completion, then the request is held
open forever and the Next.js server process spins at ~50-100% CPU.

An otherwise identical `useActionState` action **without** `.bind()` responds normally.

## Steps

```bash
npm install
npm run dev            # or: npm run build && npm run start
npm run repro          # in another terminal
```

Observed output (bug present):

```
unbound  RESPONDED 40ms 200 6151 bytes
bound    HELD - no response after 15000ms (TimeoutError)
```

Browser equivalent: open the page in Chrome with JavaScript disabled and click
the second button - the tab spins forever.
