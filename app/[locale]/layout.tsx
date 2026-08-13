import { cacheLife } from 'next/cache';

async function getLayoutData() {
  'use cache';
  cacheLife({ revalidate: 60, expire: 600, stale: 300 });
  return { title: 'shared ' + Date.now() };
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();
  return (<div><h1>{data.title}</h1>{children}</div>);
}
