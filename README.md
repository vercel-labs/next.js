# Reproduction attempt: issue #97536

Intermittent: button-driven client transition does not render in WebKit (dev), claimed
regression from `16.3.0-canary.3`.

The reporter had no public reproduction, so this is the smallest app matching the described
shape: an App Router client component multi-step form whose `Continue` button advances a
`useState` step and swaps the heading.

## Run

```bash
npm install
npx playwright install webkit --with-deps
npx next dev                # in one shell
npx playwright test --project=webkit tests/form.spec.js --repeat-each=50
npx playwright test --project=webkit tests/variants.spec.js --repeat-each=50
```

`tests/form.spec.js` is the reporter's protocol (wait for step-one heading, focus, Enter).
`tests/variants.spec.js` presses/clicks immediately after navigation commits, i.e. before
hydration can finish.

## Results (Linux WebKit 26.5 / Playwright 1.61.1, `next dev`, Turbopack)

| test | next 16.2.10 ("clean") | next 16.3.1 (affected) |
| --- | --- | --- |
| form.spec.js (reporter protocol) | 0 / 50 fail | 0 / 50 fail |
| variants A: Enter before hydration | 4 / 50 fail | 2 / 50 fail |
| variants B: click before hydration | 0 / 20 fail | 0 / 20 fail |

The reporter's protocol never failed on either version. The only failure mode found is a
keyboard activation delivered before React hydration attaches the listener; it reproduces
on 16.2.10 at least as often as on 16.3.1, so it does not bisect to `16.3.0-canary.3`.
