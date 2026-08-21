# next#95588 — streamed Suspense boundaries never reveal in a document that loads hidden

Automated reproduction for https://github.com/vercel/next.js/issues/95588
(reporter's manual repro: https://github.com/jocchiuti/next-suspense-hidden-document-repro).

App code is the reporter's minimal app (`force-dynamic` page + `loading.js`
fallback + 1.5s async delay). This copy adds a headless Chrome / CDP driver so
the hidden-document load is deterministic instead of a manual background-tab
dance.

## Run

```bash
npm install
npm run build
npm start          # terminal 1, http://localhost:3000

npm run repro      # terminal 2 (set CHROME_PATH if Chrome isn't auto-detected)
```

The driver opens a foreground tab, keeps it activated, then loads the app in a
**background tab** (`Target.createTarget { background: true }`), so the document
is hidden from birth, and probes it repeatedly.

## Observed (next 16.2.6, also 16.3.1-canary.26)

Hidden tab, still true 35s after load completed:

```json
{
  "visibilityState": "hidden",
  "readyState": "complete",
  "RB_length": 2,
  "typeof_RT": "undefined",
  "S:0_in_dom": true,
  "S:0_hidden_attr": true,
  "fallback_present": true,
  "visible_text": "Loading… (Suspense fallback)"
}
```

Foreground control tab reveals within ~1.6s (`RB_length: 0`, `typeof $RT ==
"number"`, fallback gone). Running the page's own `window.$RV(window.$RB)` in
the wedged hidden tab reveals instantly, isolating the parked
`requestAnimationFrame` in the vendored react-dom `$RC` instruction as the only
blocker:

```js
$RC=function(a,b){... 2===$RB.length&&("number"!==typeof $RT
  ? requestAnimationFrame($RV.bind(null,$RB))          // rAF never fires while hidden
  : setTimeout($RV.bind(null,$RB), ...))}
```
