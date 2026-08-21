import { Suspense } from 'react';
import Actions from './actions';

export const dynamic = 'force-dynamic';

async function Slow() {
  await new Promise((r) => setTimeout(r, 4000));
  return <p id="slow">slow data {Date.now()}</p>;
}

export default function Page() {
  return (
    <main>
      <h1 id="home">next#87681</h1>
      <Actions />
      <Suspense fallback={<p id="fallback">loading…</p>}>
        <Slow />
      </Suspense>
    </main>
  );
}
