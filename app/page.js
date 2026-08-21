// Force runtime streaming (no static prerender) so the route-level
// Suspense boundary from loading.js is streamed and revealed via the
// $RC/$RV instruction set on every document load.
export const dynamic = "force-dynamic";

export default async function Page() {
  // Simulate slow data so the shell (with the loading.js fallback)
  // flushes first and the content arrives as a late hidden segment.
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return (
    <main id="revealed">
      <h1>Content revealed</h1>
      <p>
        If you can read this, the Suspense boundary was swapped in. In a
        document that was hidden while loading, you will keep seeing the
        fallback instead — run the console checks from the README.
      </p>
    </main>
  );
}
