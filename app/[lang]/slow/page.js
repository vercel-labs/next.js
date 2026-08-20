export const dynamic = 'force-dynamic';
export default async function Slow() {
  await new Promise((r) => setTimeout(r, 1500));
  return <h1 id="publication">control slow</h1>;
}
