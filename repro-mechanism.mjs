// Isolated proof of the mechanism and of each candidate fix.
// Run with:  node --expose-gc repro-stack-pin.mjs
//
// Shape mirrors Next's dynamic-rendering.js:
//   createPrerenderInterruptedError(msg)  ->  controller.abort(error)
// The error is created inside a frame that closes over the render's payload,
// so V8's captured CallSiteInfo frames pin that payload.

const MB = 1024 * 1024;
const PAYLOAD = 8 * MB;
const N = 20;

const gc = () => {
  global.gc();
  global.gc();
};
const abMB = () => Math.round(process.memoryUsage().arrayBuffers / MB);

const makeInterruptedError = (message) => {
  const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
    value: "E394",
    enumerable: false,
    configurable: true,
  });
  error.digest = "NEXT_PRERENDER_INTERRUPTED";
  return error;
};

// One "render": a closure holding the page payload, which creates the abort
// reason from inside that closure — exactly the snapshot's shape.
const runRender = (mode) => {
  const segmentData = new Map([["/_full", Buffer.allocUnsafe(PAYLOAD)]]);
  const controller = new AbortController();

  const abortFromInsideRenderFrame = () => {
    // `segmentData` is in this frame's context; the Error created here captures
    // this frame, so the context (and the payload) becomes reachable from it.
    void segmentData.size;
    const previous = Error.stackTraceLimit;
    if (mode === "limit0") Error.stackTraceLimit = 0;
    const err = makeInterruptedError("Route /x bailed out of prerendering");
    if (mode === "limit0") Error.stackTraceLimit = previous;
    if (mode === "materialize") void err.stack;
    controller.abort(err);
  };
  abortFromInsideRenderFrame();

  // The render is over. Everything except the signal is dropped, which is what
  // production does — but the signal's `reason` survives.
  return controller.signal;
};

const measure = (mode) => {
  gc();
  const before = abMB();
  const kept = [];
  for (let i = 0; i < N; i++) kept.push(runRender(mode));
  gc();
  const held = abMB();
  // Now drop the signals too: everything must go.
  kept.length = 0;
  gc();
  const after = abMB();
  const expected = Math.round((N * PAYLOAD) / MB);
  return { mode, expected, retainedMB: held - before, afterDropMB: after - before };
};

console.log(`payload per render: ${PAYLOAD / MB} MB x ${N} renders = ${(N * PAYLOAD) / MB} MB\n`);
for (const mode of ["baseline", "materialize", "limit0"]) {
  const r = measure(mode);
  const verdict = r.retainedMB > r.expected * 0.5 ? "PINNED" : "released";
  console.log(
    `${mode.padEnd(12)} retained while signals alive: ${String(r.retainedMB).padStart(4)} MB ` +
      `(of ${r.expected} MB)  -> ${verdict};  after dropping signals: ${r.afterDropMB} MB`,
  );
}

console.log(`\nError.prepareStackTrace overridden: ${typeof Error.prepareStackTrace === "function"}`);
console.log(`Error.stackTraceLimit: ${Error.stackTraceLimit}`);
