import { cacheLife } from 'next/cache';

export default async function Page() {
  'use cache';
  cacheLife({ stale: 60, revalidate: 0.999, expire: 86400 });
  return <p>OK</p>;
}
