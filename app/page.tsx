"use client";
import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState<string>("idle");

  const onClick = async () => {
    setStatus("loading");
    try {
      const mod = await import("../components/heavy-module");
      mod.run();
      setStatus("ok");
    } catch (err) {
      setStatus(`error: ${(err as Error).message}`);
      console.error(err);
    }
  };

  return (
    <main style={{ padding: 32, fontFamily: "system-ui" }}>
      <h1>Turbopack chunk-load failure repro</h1>
      <p>
        1. Open this page (do not click yet).
        <br />
        2. DevTools &rarr; Network &rarr; Offline.
        <br />
        3. Click the button &rarr; fails (expected).
        <br />
        4. DevTools &rarr; Network &rarr; Online.
        <br />
        5. Click the button repeatedly &rarr; still fails for several seconds.
      </p>
      <button onClick={onClick} style={{ padding: "8px 16px", fontSize: 16 }}>
        Run dynamic import
      </button>
      <p>Status: {status}</p>
    </main>
  );
}
