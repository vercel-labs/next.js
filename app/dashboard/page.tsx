export const dynamic = 'force-dynamic';
import { Suspense } from 'react';

async function slowData() {
  await new Promise((r) => setTimeout(r, 3000));
  return 'SLOW_DATA';
}

async function Slow() {
  const d = await slowData();
  return <p id="slow">{d}</p>;
}

export default async function Page() {
  return (
    <main>
      <h1 id="shell">DASHBOARD_SHELL</h1>
      <Suspense fallback={<p id="fallback">SUSPENSE_FALLBACK</p>}>
        <Slow />
      </Suspense>
    </main>
  );
}
