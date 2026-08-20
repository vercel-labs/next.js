export const dynamic = 'force-dynamic';
import { unstable_cache } from 'next/cache';

// Legacy API used by the reporter (Next 14). Tag matches the route handler.
const getRated = unstable_cache(
  async () => {
    console.log('[MISS] unstable_cache page');
    return Date.now();
  },
  ['unstable-cache-page'],
  { tags: ['rated:42'] }
);

export default async function Page() {
  const value = await getRated();
  return <div id="value">{String(value)}</div>;
}
