import { getData } from '../lib/data';
export async function generateMetadata() {
  const d = await getData();
  console.log('[dashboard/metadata] got', d);
  return { title: 'dash ' + d.count };
}
export default async function Page() {
  const d = await getData();
  console.log('[dashboard/page] got', d);
  return <main>dp:{d.count}</main>;
}
