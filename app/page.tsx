import { Show } from './client';

export const dynamic = 'force-dynamic';

/** Stands in for a DB driver reading a large result set packet by packet
 *  (tedious, pg, etc.) inside a server component. */
async function longAwaitChain(n: number): Promise<number> {
  let x = 0;
  for (let i = 0; i < n; i++) {
    await Promise.resolve();
    x += 1;
  }
  return x;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ n?: string }>;
}) {
  const { n } = await searchParams;
  const value = await longAwaitChain(Number(n ?? 1000));
  return <Show value={value} />;
}
