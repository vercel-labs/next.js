import { Suspense } from 'react';

type P = Promise<{ handle: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

async function Body({ params, searchParams }: { params: P; searchParams: SP }) {
  const [p, sp] = await Promise.all([params, searchParams]);
  console.log('[server:/product]', JSON.stringify({ p, sp }));
  return (
    <div id="sp">
      params: {JSON.stringify(p)} | searchParams: {JSON.stringify(sp)}
    </div>
  );
}

export default function Page(props: { params: P; searchParams: SP }) {
  return (
    <Suspense fallback={<div id="sp">loading…</div>}>
      <Body {...props} />
    </Suspense>
  );
}
