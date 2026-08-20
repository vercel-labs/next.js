import { Suspense } from 'react';
import { revalidatePath } from 'next/cache';

type SP = Promise<Record<string, string | string[] | undefined>>;

async function Params({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  console.log('[server:/action] searchParams =', JSON.stringify(sp));
  return <div id="sp">searchParams: {JSON.stringify(sp)}</div>;
}

export default function Page({ searchParams }: { searchParams: SP }) {
  async function act() {
    'use server';
    revalidatePath('/action');
  }
  return (
    <div>
      <h1>server action + PPR searchParams</h1>
      <form action={act}>
        <button id="submit">run server action (revalidatePath)</button>
      </form>
      <hr />
      <Suspense fallback={<div id="sp">loading params…</div>}>
        <Params searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
