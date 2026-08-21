export default async function P({ params }) {
  const p = await params
  return <div id="item">FULL page section={JSON.stringify(p.section)} id={JSON.stringify(p.id)}</div>
}
