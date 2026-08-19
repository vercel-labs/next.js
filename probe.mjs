const URL_TARGET = process.env.TARGET_URL || "http://localhost:3000/";
const N = Number(process.env.N || 30);

const [t] = await (await fetch("http://127.0.0.1:9229/json/list")).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (m, p = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(m.error) : res(m.result);
  }
};
await new Promise((r) => (ws.onopen = r));
await send("Runtime.enable");
const stat = async () =>
  JSON.parse(
    (
      await send("Runtime.evaluate", {
        expression:
          "(()=>{const h=require('v8').getHeapStatistics();return JSON.stringify({ctx:h.number_of_native_contexts,det:h.number_of_detached_contexts,used:h.used_heap_size})})()",
        returnByValue: true,
        includeCommandLineAPI: true,
      })
    ).result.value
  );

// warm-up request so first-compile cost is excluded
await fetch(URL_TARGET, { redirect: "manual" });

for (let round = 1; round <= Number(process.env.ROUNDS || 3); round++) {
  await send("HeapProfiler.collectGarbage");
  const a = await stat();
  for (let i = 0; i < N; i++) await fetch(URL_TARGET, { redirect: "manual" });
  await send("HeapProfiler.collectGarbage");
  const b = await stat();
  console.log(
    `round ${round} (${URL_TARGET} x${N}): contexts +${b.ctx - a.ctx} (${a.ctx}->${b.ctx}) detached ${b.det} heap +${((b.used - a.used) / 1048576).toFixed(1)}MB (${(a.used / 1048576).toFixed(1)}->${(b.used / 1048576).toFixed(1)}MB) per-render ${(((b.used - a.used) / 1048576) / N).toFixed(2)}MB`
  );
}
process.exit(0);
