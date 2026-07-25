import Link from "next/link";
import { Checkboxes } from "./Checkboxes";

export const dynamic = "force-dynamic";

const COLORS = ["red", "blue", "green", "yellow", "purple"];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const selected: string[] = Array.isArray(params.color)
    ? params.color
    : params.color
      ? [params.color]
      : [];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px" }}>
      <h1>Scroll reproduction</h1>
      <p>
        Scroll down to the checkboxes at the bottom. Tick one checkbox, then
        tick another. The page scrolls to the top on the second tick despite{" "}
        <code>router.replace</code> being called with{" "}
        <code>{"{ scroll: false }"}</code>.{" "}
        <strong>Only reproducible in production mode.</strong>
      </p>

      {/*
        Required to trigger the bug: the Link being visible causes Next.js to
        auto-prefetch "/" on page load, writing a fulfilled entry into the
        segment route cache. This entry is then used by
        deprecated_requestOptimisticRouteCacheEntry() as the base for
        constructing an optimistic route tree when navigating to /?color=red.
        The middleware rewrites /?color=red → /?color=red&_rsc_v=1, causing
        the rendered search params to differ from the optimistic prediction.
        matchSegment() fails → task stays pending → exitStatus=1 →
        dispatchRetryDueToTreeMismatch with ScrollBehavior.Default → scroll.
      */}
      <p style={{ fontSize: 14, color: "#888" }}>
        <strong>Step 1:</strong> the prefetch is seeded automatically (the Link
        is visible in the viewport), then scroll down.{" "}
        <Link href="/" style={{ color: "#0070f3" }}>
          Home (auto-prefetched)
        </Link>
      </p>

      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          style={{
            height: 80,
            margin: "12px 0",
            borderRadius: 6,
            background: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            paddingLeft: 20,
            fontSize: 18,
            color: "#555",
          }}
        >
          Filler item {i + 1}
        </div>
      ))}

      <div
        style={{
          marginTop: 32,
          padding: 24,
          border: "2px solid #333",
          borderRadius: 8,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Filters</h2>
        <p style={{ color: "#555" }}>
          Selected: {selected.length === 0 ? "none" : selected.join(", ")}
        </p>
        <Checkboxes colors={COLORS} initialSelected={selected} />
      </div>
    </div>
  );
}
