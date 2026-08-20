export default async function PageB({ searchParams }) {
  const sp = await searchParams;
  return <p>b q={sp.q ?? 'none'}</p>;
}
