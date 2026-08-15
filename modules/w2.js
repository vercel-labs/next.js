// Variant B (two-worker ring): swap the page/worker imports to use w2.js and
// uncomment the line below to get a 2-chunk-group ring instead of a self-ring.
// const w = new Worker(new URL('./w1.js', import.meta.url));
self.onmessage = (e) => { postMessage(e.data); };
