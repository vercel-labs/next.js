const MB = 1024 * 1024, PAYLOAD = 8 * MB, N = 20;
const gc = () => { global.gc(); global.gc(); };
const abMB = () => Math.round(process.memoryUsage().arrayBuffers / MB);

const makeInterruptedError = (message) => {
  const error = Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE",
    { value: "E394", enumerable: false, configurable: true });
  error.digest = "NEXT_PRERENDER_INTERRUPTED";
  return error;
};

const runRender = (mode) => {
  const segmentData = new Map([["/_full", Buffer.allocUnsafe(PAYLOAD)]]);
  const controller = new AbortController();
  const abortFromInsideRenderFrame = () => {
    void segmentData.size;
    const previous = Error.stackTraceLimit;
    if (mode === "limit0") Error.stackTraceLimit = 0;
    const err = makeInterruptedError("Route /x bailed out of prerendering");
    if (mode === "limit0") Error.stackTraceLimit = previous;
    if (mode === "materialize") void err.stack;
    controller.abort(err);
  };
  abortFromInsideRenderFrame();
  return controller.signal;
};

for (const mode of ["baseline", "materialize", "limit0"]) {
  gc(); const before = abMB();
  const kept = []; for (let i = 0; i < N; i++) kept.push(runRender(mode));
  gc(); const held = abMB();
  console.log(`${mode.padEnd(12)} retained: ${held - before} MB of ${(N * PAYLOAD) / MB} MB`);
}
