// Counts composite AbortSignals created by Next's `use cache` wrapper and how
// many are STILL ALIVE after forced GCs. Run the server with
//   node --expose-gc --inspect=127.0.0.1:9231 --require ./preload-any.cjs .next/standalone/server.js
// then hit some distinct /p/<slug> URLs, then run this.
const CDP = process.env.CDP || "http://127.0.0.1:9231";
const t = (await (await fetch(`${CDP}/json/list`)).json()).find((x) => x.webSocketDebuggerUrl);
if (!t) { console.error("no CDP target — start the server with --inspect=127.0.0.1:9231"); process.exit(1); }
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 1; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Runtime.enable"); await send("HeapProfiler.enable");
for (let i = 0; i < 3; i++) await send("HeapProfiler.collectGarbage");
const r = await send("Runtime.evaluate", { expression: "JSON.stringify(globalThis.__anyStats())", returnByValue: true });
const d = JSON.parse(r.result.value);
console.log(`composites created: ${d.created}   STILL ALIVE after GC: ${d.stillAlive}`);
ws.close(); process.exit(0);
