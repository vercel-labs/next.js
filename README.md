# Repro: Emotion component selectors fail when styled() options is a variable (#46973)

`compiler.emotion: true`, Next canary (Turbopack dev).

```
npm install
npm run dev
# open http://localhost:3000        -> 500 "Component selectors can only be used ..."
# open http://localhost:3000/inline -> works (inline options object literal)
# open http://localhost:3000/simple -> works (no options argument)
# npm run build                     -> succeeds, prerendered HTML contains color:green
```

`app/page.js` uses `styled('div', options)` where `options` is a variable; the SWC
emotion transform then does not add the component-selector `target`, so
`${A}` interpolation throws at render time in dev.
