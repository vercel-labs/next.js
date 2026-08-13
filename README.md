# Reproduction for vercel/next.js#97316

Prerender-interrupt `Error` stored as `AbortSignal.reason` never has `.stack` read, so V8 keeps its
structured stack trace (`CallSiteInfo` frames) alive; each frame pins its function's `Context` and
therefore the whole closure graph of the render that created it.

## Run

```
npm install
npm run repro        # reporter's isolated mechanism repro
npm run repro:next   # same, but driving Next.js's own shipped abort code path
```

`repro:next` calls the real exported `abortOnSynchronousPlatformIOAccess` from
`next/dist/server/app-render/dynamic-rendering.js` (next@16.3.0) with a fake prerender store, from
inside a frame that holds an 8 MB `segmentData` buffer, then drops everything except the
`AbortSignal`.

## Observed (node v24.17.0, next 16.3.0)

```
next 16.3.0 node v24.17.0
baseline     retained: 160 MB of 160 MB   <-- whole payload pinned by the abort Error's frames
materialize  retained:   0 MB of 160 MB   <-- `void err.stack` releases the frames
limit0       retained:   0 MB of 160 MB   <-- Error.stackTraceLimit = 0 around `new Error`
```

`createPrerenderInterruptedError` is byte-identical (and unfixed) in 16.3.0 and 16.3.1-canary.15.
