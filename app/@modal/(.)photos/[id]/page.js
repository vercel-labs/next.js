export default async function PhotoModal({ params }) {
  const { id } = await params
  return <div id="modal">MODAL photo {id}</div>
}
