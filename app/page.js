import { Suspense } from 'react';

async function Slow() {
  await new Promise((r) => setTimeout(r, 3000));
  return <p id="slow">slow content</p>;
}

export default function Page() {
  return (
    <main>
      <h1 id="shell">shell</h1>
      <Suspense fallback={<p id="fallback">loading…</p>}>
        <Slow />
      </Suspense>
    </main>
  );
}
