import { Suspense } from "react";
import { connection } from "next/server";
import { readStatus } from "@/lib/store";
import { markReady } from "./actions";

async function StatusInner() {
  await connection();
  const status = await readStatus();
  return (
    <>
      <p style={{ fontSize: 18 }}>
        Current status:{" "}
        <strong data-testid="status-value" style={{ color: status === "ready" ? "#137333" : "#b06000" }}>
          {status}
        </strong>
      </p>
      <form action={markReady}>
        <button
          type="submit"
          data-testid="mark-ready"
          style={{ padding: "8px 16px", fontSize: 16, cursor: "pointer" }}
        >
          Mark ready
        </button>
      </form>
    </>
  );
}

export default function StatusPage() {
  return (
    <main style={{ maxWidth: 520 }}>
      <h1>Status</h1>
      <Suspense fallback={<p data-testid="status-value">loading</p>}>
        <StatusInner />
      </Suspense>
      <p style={{ color: "#666", fontSize: 13 }}>
        Ground truth (bypasses the browser pool):{" "}
        <a href="/api/state" data-testid="api-link">
          /api/state
        </a>
      </p>
    </main>
  );
}
