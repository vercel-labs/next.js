export const dynamic = 'force-dynamic';
import { unstable_cacheTag as cacheTag } from 'next/cache';

// Modern API control case: this one IS revalidated by the same route handler.
async function getRated() {
  'use cache';
  cacheTag('rated:42');
  console.log('[MISS] use-cache page');
  return Date.now();
}

export default async function Page() {
  const value = await getRated();
  return <div id="value">{String(value)}</div>;
}
