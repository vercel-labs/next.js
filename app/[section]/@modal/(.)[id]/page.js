export default async function M({ params }) {
  const p = await params
  return <div id="modal">MODAL id={JSON.stringify(p.id)}</div>
}
