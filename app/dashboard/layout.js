import { getData } from '../lib/data';
export default async function DashboardLayout({ children }) {
  const d = await getData();
  console.log('[dashboard/layout] got', d);
  return <section>dl:{d.count}{children}</section>;
}
