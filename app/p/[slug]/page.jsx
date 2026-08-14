// Reproduces the composite-signal retention in Next's `use cache` wrapper.
//
// The wrapper builds `AbortSignal.any([dynamicAccessAbortSignal, timeout.signal])`
// per cached evaluation and hands it to prerender(), which attaches an abort
// listener. Node pins such a composite in its process-global gcPersistentSignals
// Set while any listener is attached; on the normal completion path nothing ever
// aborts, so it is never released — and through the listener closure it retains
// the whole cached render.
export const instant = false;

import { Suspense } from "react";
import { headers } from "next/headers";
import { cacheLife } from "next/cache";

async function CachedBody({ slug }) {
  "use cache";
  cacheLife("hours");
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

// An uncached request-scoped read, so the enclosing render is a real prerender
// with dynamic-access tracking — that is what makes dynamicAccessAbortSignal
// defined and therefore makes the wrapper build a composite.
async function Dynamic() {
  const h = await headers();
  return <p>ua-length: {(h.get("user-agent") || "").length}</p>;
}

// A route with generateStaticParams gets a FALLBACK SHELL prerender, and that
// is the pass that runs with dynamic-access tracking — which is what makes
// `dynamicAccessAsyncStorage.getStore()?.abortController.signal` defined and
// therefore makes the use-cache wrapper build the composite. Without this the
// wrapper takes the `: timeoutAbortController.signal` branch and nothing leaks.
export async function generateStaticParams() {
  return [{ slug: "seed-1" }, { slug: "seed-2" }];
}

export default async function Page({ params }) {
  const { slug } = await params;
  return (
    <main>
      <h1>page {slug}</h1>
      <Suspense fallback={<p>loading…</p>}>
        <Dynamic />
      </Suspense>
      <CachedBody slug={slug} />
    </main>
  );
}
