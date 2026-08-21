export const dynamic = 'force-dynamic';
// Slow destination page (2s) so the transition window is easy to observe
export default async function Gleb() {
  await new Promise((r) => setTimeout(r, 2000));
  return <div>GLEB CONTENT{' '}{'.'.repeat(2000)}</div>;
}
