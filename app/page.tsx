import { Suspense } from 'react';

async function Dynamic() {
  const now = await new Promise<number>((r) => setTimeout(() => r(Date.now()), 10));
  return <p id="dyn">dynamic {now}</p>;
}

export default function Page() {
  return (
    <main>
      <h1 id="shell">static shell</h1>
      <Suspense fallback={<p id="fallback">loading…</p>}>
        <Dynamic />
      </Suspense>
    </main>
  );
}
