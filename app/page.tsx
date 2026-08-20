import { Suspense } from 'react';
import Link from 'next/link';
import Reload from './Reload';

async function Params({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  console.log('[server] searchParams =', JSON.stringify(sp));
  return <div id="sp">searchParams: {JSON.stringify(sp)}</div>;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <div>
      <h1>PPR searchParams repro (#59407)</h1>
      <Link href="/?id=1">go to /?id=1</Link>
      <hr />
      <Reload />
      <hr />
      <Suspense fallback={<div id="sp">loading params…</div>}>
        <Params searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return { title: `sp=${JSON.stringify(sp)}` };
}
