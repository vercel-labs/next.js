"use client";

import { useState } from "react";

export default function Page() {
  const [log, setLog] = useState([]);
  const add = (m) => setLog((l) => [...l, String(m)]);

  return (
    <main style={{ fontFamily: "monospace", padding: 20 }}>
      <button
        id="worker"
        onClick={() => {
          const w = new Worker(new URL("./worker/worker.js", import.meta.url));
          w.onmessage = (e) => add("worker url resolved + message: " + e.data);
          w.postMessage("ping");
        }}
      >
        run worker
      </button>
      <button
        id="worklet-url"
        onClick={async () => {
          const url = new URL("./worklet/worklet.js", import.meta.url);
          add("worklet url: " + url.pathname);
          const res = await fetch(url);
          const text = await res.text();
          add("worklet served bytes: " + text.length);
          add("worklet contains bare import: " + /import\s*\{\s*GAIN/.test(text));
          const ctx = new AudioContext();
          try {
            await ctx.audioWorklet.addModule(url);
            add("addModule OK");
          } catch (e) {
            add("addModule FAILED: " + e.name + ": " + e.message);
          }
        }}
      >
        run worklet
      </button>
      <pre id="log">{log.join("\n")}</pre>
    </main>
  );
}
