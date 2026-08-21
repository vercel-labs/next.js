import { Suspense } from 'react';
import { connection } from 'next/server';
import { Cloner, Leaf } from './cloner';

export const dynamic = 'force-dynamic';

async function ServerComponent() {
  await connection();
  return (
    <div>
      <Cloner text={'a'.repeat(4000)}>
        <Leaf label="hello" />
      </Cloner>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>loading…</p>}>
      <ServerComponent />
    </Suspense>
  );
}
