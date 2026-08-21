# Repro: `cacheComponents` Activity reappear breaks imperative DOM/WebGL libraries

Issue: https://github.com/vercel/next.js/issues/93495

`FakeMap` in `app/fake-map-gl.js` is a ~20 line stand-in for Mapbox GL / Leaflet /
Three.js: its `remove()` drops the internal DOM reference (`this._container = null`),
just like `mapboxgl.Map#remove()`.

`/map` uses the very common "create once, keep it in a ref" pattern. With
`cacheComponents: true` the previous route is kept alive in `<Activity mode="hidden">`,
so refs/state survive while effects are cleaned up. On reappear the effect re-runs,
sees a non-null ref, reuses the *destroyed* instance and crashes:

```
TypeError: Cannot read properties of null (reading 'appendChild')
```

`/map-fixed` shows the recommended pattern: create the instance inside the effect
(or force a remount with a `key`) so a reappear always builds a fresh instance.

## Steps

```bash
npm install
npm run build && npm start   # production build is required to see the Activity path
```

1. open http://localhost:3000
2. click "Go to /map"  -> `map created`, `marker added`
3. click "Go to /" -> `map cleanup -> map.remove()`
4. click "Go to /map" again -> `map effect re-ran, reusing existing instance` +
   `TypeError: Cannot read properties of null (reading 'appendChild')`, the map
   subtree is gone.

Repeat with "Go to /map-fixed": the instance is recreated and nothing crashes.

## Notes

- Removing `cacheComponents: true` from `next.config.js` makes step 4 fully remount
  the client component (`map created` again) and the crash disappears, i.e. the crash
  is specific to the Activity-based route preservation.
- `next dev` hits the same crash on first mount because Strict Mode double-invokes
  effects, which is a cheap way to detect the pattern.
