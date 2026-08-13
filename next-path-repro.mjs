// Drives Next.js's OWN shipped abort path (next/dist/server/app-render/dynamic-rendering.js)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const dr = require('next/dist/server/app-render/dynamic-rendering.js');
const nextVersion = require('next/package.json').version;

const MB = 1024 * 1024, PAYLOAD = 8 * MB, N = 20;
const gc = () => { global.gc(); global.gc(); };
const abMB = () => Math.round(process.memoryUsage().arrayBuffers / MB);

const runRender = (mode) => {
  // Stand-in for a cached page value with segmentData buffers, held by the render frame.
  const segmentData = new Map([['/_full', Buffer.allocUnsafe(PAYLOAD)]]);
  const controller = new AbortController();
  const prerenderStore = { type: 'prerender', controller, dynamicTracking: null };
  const abortFromInsideRenderFrame = () => {
    void segmentData.size; // payload lives in this frame's context
    const prev = Error.stackTraceLimit;
    if (mode === 'limit0') Error.stackTraceLimit = 0;
    dr.abortOnSynchronousPlatformIOAccess('/dyn', '`Date.now()`', new Error('sync io'), prerenderStore);
    if (mode === 'limit0') Error.stackTraceLimit = prev;
    if (mode === 'materialize') void controller.signal.reason.stack;
  };
  abortFromInsideRenderFrame();
  return controller.signal; // only the signal survives, as in prod
};

console.log('next', nextVersion, 'node', process.version);
for (const mode of ['baseline', 'materialize', 'limit0']) {
  gc(); const before = abMB();
  const kept = []; for (let i = 0; i < N; i++) kept.push(runRender(mode));
  gc(); const held = abMB();
  console.log(`${mode.padEnd(12)} retained: ${held - before} MB of ${(N * PAYLOAD) / MB} MB (signals kept: ${kept.length}, reason digest: ${kept[0].reason.digest})`);
}
