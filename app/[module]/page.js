export default async function Page({ params, searchParams }) {
  const p = await params; const s = await searchParams;
  console.log('[page] params =', p, 'searchParams =', s);
  return <p id="page-params">page params: {JSON.stringify(p)} search: {JSON.stringify(s)}</p>;
}
