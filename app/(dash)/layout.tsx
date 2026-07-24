import type { ReactNode } from "react";
import Link from "next/link";
import { PrefetchPressure } from "@/components/prefetch-pressure";

// The sidebar: ~60 links to distinct dynamic pages. Navigating into this layout
// mounts them all at once; the App Router prefetches the viewport-visible ones,
// firing a burst of `_rsc` GETs. Behind the latency proxy each is held open ~4s,
// so all 6 of Chrome's per-origin HTTP/1.1 sockets are occupied at once — exactly
// the state a Server Action POST is then fired into.
//
// Count is read at request time so it can be tuned without a rebuild (REPRO_LINKS).
const LINK_COUNT = Number(process.env.REPRO_LINKS ?? 60);

export default function DashLayout({ children }: { children: ReactNode }) {
  const items = Array.from({ length: LINK_COUNT }, (_, i) => i + 1);
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav
        aria-label="Sidebar"
        style={{
          width: 200,
          flexShrink: 0,
          borderRight: "1px solid #ddd",
          padding: "12px 8px",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Link href="/status" prefetch style={{ display: "block", padding: "4px 8px", fontWeight: 600 }}>
          Status
        </Link>
        {items.map((i) => (
          <Link
            key={i}
            href={`/item/${i}`}
            prefetch
            style={{ display: "block", padding: "4px 8px", color: "#0366d6" }}
          >
            Item {i}
          </Link>
        ))}
      </nav>
      <div style={{ flex: 1, padding: 32 }}>{children}</div>
      <PrefetchPressure />
    </div>
  );
}
