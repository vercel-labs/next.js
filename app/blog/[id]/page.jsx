// Route has generateStaticParams + revalidate (the original issue's setup),
// and awaits searchParams -> should render the real query string.
export default async function Page({ params, searchParams }) {
  const sp = await searchParams;
  const p = await params;
  console.log('[blog] params=', p, 'searchParams=', sp);
  return <pre id="out">{JSON.stringify(sp)}</pre>;
}
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
export const revalidate = 60;
