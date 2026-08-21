"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    console.log("[REPRO] React hydrated successfully!");
    setHydrated(true);
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Turbopack Hydration Repro</h1>

      <p style={{ color: hydrated ? "green" : "red" }}>
        {hydrated
          ? "✅ React hydrated — useEffect fired, events attached"
          : "❌ Waiting for hydration... (useEffect never fires on 16.2.6 in WebView)"}
      </p>

      <button
        onClick={() => {
          console.log("[REPRO] Button clicked!", count + 1);
          setCount((c) => c + 1);
        }}
        style={{
          padding: "12px 24px",
          fontSize: 16,
          marginTop: 12,
          cursor: "pointer",
        }}
        type="button"
      >
        Clicked: {count}
      </button>

      <hr style={{ margin: "24px 0" }} />
      <h2>How to reproduce</h2>
      <ol>
        <li>Run <code>TAURI_DEV_HOST=YOUR_LAN_IP pnpm dev</code></li>
        <li>Open <code>http://YOUR_LAN_IP:3000</code> in an Android WebView (e.g., via Tauri v2 <code>android dev</code>)</li>
        <li>On Next.js 16.2.6: the red text stays, button doesn&apos;t respond</li>
        <li>Downgrade to <code>next@16.0.10</code>: green text appears, button works</li>
      </ol>
    </div>
  );
}
