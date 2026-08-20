import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

async function Slow() {
  // mimic the reporter's slow endpoint (5 second response)
  await new Promise((r) => setTimeout(r, 5000));
  return <p id="data">DATA: slow payload</p>;
}

export default function Home() {
  return (
    <main>
      <h1 id="shell">Home shell rendered</h1>
      <Suspense fallback={<p id="fallback">Loading data...</p>}>
        <Slow />
      </Suspense>
    </main>
  );
}
