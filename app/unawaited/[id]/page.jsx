// Reporter's original code shape: searchParams is never awaited/accessed,
// so the route stays prerendered (SSG) and nothing dynamic is read.
export default function Page({ searchParams }) {
  console.log('[unawaited]', searchParams);
  return <pre id="out">{JSON.stringify(searchParams)}</pre>;
}
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
export const revalidate = 60;
