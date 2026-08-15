const w = new Worker(new URL('./w1.js', import.meta.url));
self.onmessage = (e) => { w.postMessage(e.data); };
