// Next 16.3 requires this opt-in for a route that blocks on uncached data
// during prerender (blocking-prerender-dynamic).
export const instant = false;

import { Suspense } from "react";

// THE TRIGGER. Under cacheComponents, synchronous platform IO during a
// prerender routes through node-environment-extensions/io-utils.js `io()` ->
// abortOnSynchronousPlatformIOAccess -> abortOnSynchronousDynamicDataAccess ->
// createPrerenderInterruptedError, whose Error becomes AbortSignal.reason.
// That is the code path under test; an awaited headers() read does NOT take it.
async function Uncached() {
  const t = Date.now();
  return <p>rendered at {t}</p>;
}

// A chunky shell so each retained render graph is big enough to see.
function Rows({ slug }) {
  return (
    <ul>
      {Array.from({ length: 3000 }, (_, i) => (
        <li key={i}>
          {slug} row {i} — {"lorem ipsum dolor sit amet consectetur adipiscing elit ".repeat(2)}
        </li>
      ))}
    </ul>
  );
}

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <main>
      <h1>page {slug}</h1>
      <Suspense fallback={<p>loading…</p>}>
        <Uncached />
      </Suspense>
      <Rows slug={slug} />
    </main>
  );
}
