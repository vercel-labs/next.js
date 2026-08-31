import { cookies, headers } from 'next/headers';
export const dynamic = 'force-dynamic';
async function slowData(id: string) {
  const res = await fetch(`http://localhost:${process.env.PORT || 3000}/api/data?id=${id}`, { next: { revalidate: 60, tags: [`product-${id}`] } });
  const json = (await res.json()) as { rows: any[] };
  await new Promise((r) => setTimeout(r, 1200));
  return json.rows;
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await cookies();
  const h = await headers();
  const rows = await slowData(id);
  return (<main><h1>{id}</h1><p>{c.size} / {h.get('user-agent')?.slice(0,20)}</p><ul>{rows.map((r:any)=>(<li key={r.id} data-sku={r.sku} data-price={r.price}>{r.description}</li>))}</ul></main>);
}
