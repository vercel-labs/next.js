import { getData } from './lib/data';
export default async function Page() {
  const d = await getData();
  console.log('[page] got', d);
  return <main id="page">page:{d.count}</main>;
}
