import { getData } from './lib/data';
export default async function RootLayout({ children }) {
  const d = await getData();
  console.log('[layout] got', d);
  return (<html><body><div>layout:{d.count}</div>{children}</body></html>);
}
