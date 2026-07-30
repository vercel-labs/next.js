import { Suspense } from "react";
import { PRE_READ_DELAY_MS, sleep } from "../lib/cache";
import { readLateData } from "../lib/late-cache";

/**
 * Reaches the `late-data` cache entry only after a long stretch of *uncached*
 * async work. By the time the read starts, the runtime prerender that is
 * driving this render has already decided that "all caches are filled" and has
 * aborted its render signal.
 */
async function LateSection() {
  await sleep(PRE_READ_DELAY_MS);
  return <p data-testid="late">{await readLateData()}</p>;
}

export default function SlowPage() {
  return (
    <main>
      <h1>slow</h1>
      <Suspense fallback={<p>loading…</p>}>
        <LateSection />
      </Suspense>
    </main>
  );
}
